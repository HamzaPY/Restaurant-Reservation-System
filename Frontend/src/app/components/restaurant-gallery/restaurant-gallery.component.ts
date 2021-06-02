import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-restaurant-gallery',
  templateUrl: './restaurant-gallery.component.html',
  styleUrls: ['./restaurant-gallery.component.css']
})
export class RestaurantGalleryComponent implements OnInit {

  unSubscriber: Subscription;
  shower = 0;
  Restaurants:any = [];
  restImages:any = [];
  check = 0;
  faSignOutAlt = faSignOutAlt;
  registerForm: FormGroup;
  submitted = false;
  restName = localStorage.getItem('loginName');
  images;
  filesToUpload: Array<File> = [];

  constructor (
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private adminService: RestaurantService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.readImages();
    this.registerForm = this.formBuilder.group({
      rPhotos: [null, Validators.required],
    });
  }

  get f() { 
    return this.registerForm.controls;
  }

  fileChangeEvent(fileInput: any) {
      this.filesToUpload = <Array<File>>fileInput.target.files;
      //this.product.photo = fileInput.target.files[0]['name'];
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
  }  

  hideloader2() { 
    document.getElementById('loading2') 
        .style.display = 'none'; 
  }  

  readImages() {
    this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      if (data)
      {
        this.hideloader();
        this.hideloader2();
        this.shower = 1;
      }
      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.Restaurants[i].name == this.restName)
        {
          this.restImages = this.Restaurants[i].galleryImages;
          break;
        }
      }

    });
  }
  

  onSubmit() {
    this.submitted = true;
    const files: Array<File> = this.filesToUpload;
    console.log(files);
    this.images = files;
      
    this.ngxLoader.start();
    this.unSubscriber = this.adminService.addPhotos(this.images, this.restName).subscribe(
      (res) => {
        console.log('Gallery successfully created!')
        if (res.status == 200)
        {
          this.ngxLoader.stop();
          this.check = this.check + 1;

          if (this.check == 1)
          {
            Swal.fire({
              icon: 'success',
              title: 'Galerie erfolgreich aktualisiert!',
              showConfirmButton: false,
              timer: 2000
            })
            console.log('Gallery successfully created!')
            setTimeout(() => 
            {
              window.location.reload();
            },
            2000);
          }
          this.ngOnDestroy();
        }
      }, (error) => {
        console.log(error);
        console.exception("ss");
      });
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
