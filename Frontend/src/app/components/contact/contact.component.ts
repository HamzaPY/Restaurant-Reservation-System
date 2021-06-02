import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { faFacebook, faInstagram, faYoutube, faTwitter, faLinkedin, faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as AOS from 'aos';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faYoutube = faYoutube;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faAndroid = faAndroid;
  faApple = faApple;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private adminService: AdminService,
    private restService: RestaurantService,
    private ngxLoader: NgxUiLoaderService
  ) 
  {}

  ngOnInit() {
    AOS.init({
      duration: 1200,
    })
    this.registerForm = this.formBuilder.group({
      contName: ['', Validators.required],
      contAddress: [''],
      contPhone: ['', Validators.required],
      contEmail: ['', Validators.required],
      contPackage: ['', Validators.required],
      contMessage: ['', Validators.required],
      contChecker: ['', Validators.required]
    });
  }

  selectPackage(name: string) {
    this.registerForm.controls.contPackage.setValue(name);
  }

  get f() { 
    return this.registerForm.controls;
  }

  sendEmail() {
    this.submitted = true;

    if (!this.registerForm.valid) 
    {
      return false;
    } 
    else 
    {
      this.ngxLoader.start();
      this.restService.sendContact(this.registerForm.value).subscribe(
        (res) => {
          if (res.status == 200)
          {
            this.ngxLoader.stop();
            console.log('Mail successfully send!');
            Swal.fire({
              icon: 'success',
              title: 'Thank you for contacting us!',
              showConfirmButton: false,
              timer: 2000
            })
            setTimeout(() => 
            {
              window.location.reload();
            },
            2000);
          }
        }, (error) => {
          console.log(error);
          console.exception("ss");
      });
    }
  }

}
