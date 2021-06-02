import { Router } from '@angular/router';
import { AdminService } from './../../service/admin.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  submitted = false;
  playerForm: FormGroup;
  faSignOutAlt = faSignOutAlt;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: AdminService,
    private ngxLoader: NgxUiLoaderService
  ) { 
    this.mainForm();
  }

  ngOnInit() {
  }

  mainForm() {
    this.playerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      admin: true
    })
  }
  
  get myForm(){
    return this.playerForm.controls;
  }

  onSubmit() {
   
    this.submitted = true;

    if (!this.playerForm.valid) {
      return false;
    } else {
  
      this.ngxLoader.start();
      this.apiService.Register(this.playerForm.value).subscribe(
        (res) => {
          this.ngxLoader.stop();
          Swal.fire({
            icon: 'success',
            title: 'Admin erfolgreich registriert!',
            showConfirmButton: false,
            timer: 2000
          })
          console.log('Admin successfully created!')
          setTimeout(() => 
          {
            this.ngZone.run(() => this.router.navigateByUrl('/adminDashboard'))
          },
          2000);
        }, (error) => {
          this.ngxLoader.stop();
          alert('Benutzername existiert bereits!')
          console.log(error);
          console.exception("ss");
        });
    }
  }

  logout() {
    this.apiService.logout();
    this.router.navigateByUrl('/')
  }

}
