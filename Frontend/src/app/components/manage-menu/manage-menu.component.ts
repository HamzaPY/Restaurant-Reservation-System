import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { Router } from '@angular/router';
import { faSignOutAlt, faPlusCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.css']
})
export class ManageMenuComponent implements OnInit {

  unSubscriber: Subscription;
  faSignOutAlt = faSignOutAlt;
  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faTrash = faTrash;
  restName = localStorage.getItem('loginName');
  catcher = 0;
  registerForm: FormGroup;
  registerForm2: FormGroup;
  submitted = false;
  submitted2 = false;
  image;
  image2;
  check1 = 0;
  check2 = 0;
  check3 = 0;
  Menu:any = [];
  showMenu:any = [];
  shower = 0;

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private adminService: RestaurantService,
    private ngxLoader: NgxUiLoaderService
    )
    {}

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          itemFile: [null, Validators.required],
          iName: ['', Validators.required],
          iPrice: [0, Validators.required],
          iDesc: [''],
          iCategory: ['', Validators.required],
          iRest: ['']
      });
      this.registerForm2 = this.formBuilder.group({
          cImage: [null, Validators.required],
          cName: ['', Validators.required],
          iRest: ['']
      });
      this.readMenu();
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
  }  

  readMenu(){ 
    this.adminService.getMenu().subscribe((data) => {
     this.Menu = data;
     if (data)
     {
       this.hideloader();
       this.shower = 1;
     }
     for (let i = 0; i < this.Menu.length; i++)
     {
       if (this.Menu[i].itemRest == this.restName)
       {
         this.catcher = 1;
        for (let j = 0; j < this.Menu[i].itemCategory.length; j++)
        {
          this.showMenu.push(this.Menu[i].itemCategory[j]);
        }
        break;
       }
     }
     console.log(this.showMenu);
    })
  }

  removeCategory(cateId) {
    if(window.confirm('Are you sure?')) {
      this.adminService.deleteCategory(cateId, this.restName).subscribe((res) => {
        window.location.reload();
       },
       err => {
         console.error(err)
       })  
    }
  }

  removeItem(itemId, cateId) {
    if(window.confirm('Are you sure?')) {
      this.adminService.deleteItem(itemId, cateId, this.restName).subscribe((res) => {
        window.location.reload();
       },
       err => {
         console.error(err)
       })  
    }
  }

  
  editItem(itemId, cateId) {
    this.router.navigateByUrl(`/editItem/${itemId}/${cateId}/${this.restName}`);
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  selectImage2(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image2 = file;
    }
  }

  get f() { 
    return this.registerForm.controls;
  }

  get fCat() { 
    return this.registerForm2.controls;
  }


  selectCate(category: string) {
    this.registerForm.controls.iCategory.setValue(category);
  }
  

  onSubmit2() {
    this.submitted2 = true;
    this.registerForm2.controls.iRest.setValue(this.restName);

    if (!this.registerForm2.valid) {
      return false;
    } else {
      if (this.catcher == 0)
      {
        this.ngxLoader.start();
        this.unSubscriber = this.adminService.addMenu(this.registerForm2.value, this.image2).subscribe(
          (res) => {
            if (res.status == 200)
            {
              this.ngxLoader.stop();
              this.check2 = this.check2 + 1;
    
              if (this.check2 == 1)
              {
                Swal.fire({
                  icon: 'success',
                  title: 'Kategorie erfolgreich hinzugefügt!',
                  showConfirmButton: false,
                  timer: 1500
                })
                console.log('Category successfully created!')
                setTimeout(() => 
                {
                  window.location.reload();
                },
                1500);
              }
              this.ngOnDestroy();
            }
          }, (error) => {
            //alert(error);
            console.log(error);
            console.exception("ss");
          });
      }
      else
      {
        this.ngxLoader.start();
        this.unSubscriber = this.adminService.addMenuCategory(this.registerForm2.value, this.image2).subscribe(
          (res) => {
            if (res.status == 200)
            {
              this.ngxLoader.stop();
              this.check1 = this.check1 + 1;
    
              if (this.check1 == 1)
              {
                Swal.fire({
                  icon: 'success',
                  title: 'Kategorie erfolgreich hinzugefügt!',
                  showConfirmButton: false,
                  timer: 1500
                })
                console.log('Category successfully created!')
                setTimeout(() => 
                {
                  window.location.reload();
                },
                1500);
              }
              this.ngOnDestroy();
            }
          }, (error) => {
            //alert(error);
            console.log(error);
            console.exception("ss");
          });
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.registerForm.controls.iRest.setValue(this.restName);

    if (!this.registerForm.valid) {
      return false;
    } else {
      this.ngxLoader.start();
      this.unSubscriber = this.adminService.addItems(this.registerForm.value, this.image).subscribe(
          (res) => {
            if (res.status == 200)
            {
              this.ngxLoader.stop();
              this.check3 = this.check3 + 1;
    
              if (this.check3 == 1)
              {
                Swal.fire({
                  icon: 'success',
                  title: 'Artikel erfolgreich hinzugefügt!',
                  showConfirmButton: false,
                  timer: 1500
                })
                console.log('Item successfully created!')
                setTimeout(() => 
                {
                  window.location.reload();
                },
                1500);
              }
              this.ngOnDestroy();
            }
          }, (error) => {
            //alert(error);
            console.log(error);
            console.exception("ss");
          });
    }
  }

  ngOnDestroy() { 
    if (this.unSubscriber)
    {
      this.unSubscriber.unsubscribe();
    }
  }

  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }

}
