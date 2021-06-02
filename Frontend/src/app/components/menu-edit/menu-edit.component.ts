import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css']
})
export class MenuEditComponent implements OnInit {

  Menu:any = [];
  category:any = [];
  faSignOutAlt = faSignOutAlt;
  editForm: FormGroup;
  submitted = false;
  iName = '';
  valName = '';
  valPrice = '';

  constructor (
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private adminService: RestaurantService
  ) {}

  ngOnInit() {
    this.updateMenu();
    let itemId = this.actRoute.snapshot.paramMap.get('id');
    let cateId = this.actRoute.snapshot.paramMap.get('cateId');
    let rest = this.actRoute.snapshot.paramMap.get('name');
    this.getItem(itemId, cateId, rest);
    this.editForm = this.formBuilder.group({
      iName: ['', Validators.required],
      iPrice: [0, Validators.required],
      iDesc: ['']
    })
  }

  // Getter to access form control
  get f() {
    return this.editForm.controls;
  }

  getItem(itemId, cateId, rest) {
    this.adminService.getItemById(itemId, cateId, rest).subscribe(data => {
      this.category = data[0].itemCategory.items;
      for (let i = 0; i < this.category.length; i++)
      {
        if (this.category[i]._id == itemId)
        {
          this.editForm.setValue({
            iName: this.category[i].itemName,
            iPrice: this.category[i].itemPrice,
            iDesc: this.category[i].itemDesc
          });
          break;
        }
      }
    });
  }

  updateMenu() {
    this.editForm = this.formBuilder.group({
      iName: ['', Validators.required],
      iPrice: [0, Validators.required],
      iDesc: ['']
    })
  }

  onSubmit() {
      this.submitted = true;
      if (!this.editForm.valid) {
        return false;
      } else {
        let itemId = this.actRoute.snapshot.paramMap.get('id');
        let cateId = this.actRoute.snapshot.paramMap.get('cateId');
        let rest = this.actRoute.snapshot.paramMap.get('name');
        this.adminService.updateItem(itemId, cateId, rest, this.editForm.value)
            .subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Artikel erfolgreich aktualisiert!',
                showConfirmButton: false,
                timer: 2000
              })
              console.log('Content Updated Successfully!')
              setTimeout(() => 
              {
                this.router.navigateByUrl('/manageMenu');
              },
              2000);
            }, (error) => {
              console.log(error)
            })
      }
  }

  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }

}
