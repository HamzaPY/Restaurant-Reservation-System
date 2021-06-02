import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  currCustomer = sessionStorage.getItem('custLogin');

  unSubscriber: Subscription;
  check = 0;
  registerForm2: FormGroup;
  submitted2 = false;
  image;

  faSignOutAlt = faSignOutAlt;

  counter = 0;
  public username: string;
  public password: string;
  public error: string;
  Users:any = [];
  Customers:any = [];

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private ngxLoader: NgxUiLoaderService
    )
    {}

  ngOnInit() {
    this.registerForm2 = this.formBuilder.group({
      imageFile: [null],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      confPassword: ['', Validators.required],
      termC: ['', Validators.required]
    });
  }

  get f() { 
    return this.registerForm2.controls;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  errorNull() {
    this.error = "";
  }

  public submit() {

    this.error = "";
    this.counter = 0;
    for (let i = 0; i < this.Customers.length; i++)
    {
      if (this.Customers[i].username == this.username)
      {
        if (this.Customers[i].emailVerify == false)
        {
          this.counter = 1;
          this.error = "Bitte bestätigen sie ihre E-Mail Adresse!"
        }
        else
        {
          this.counter = 1;
          this.adminService.loginCust(this.username, this.password)
          .pipe(first())
          .subscribe(

            result => 
            {
              sessionStorage.setItem('custLogin',this.username);
              window.location.reload()
            },
            err => 
            {
              this.error = 'Konnte nicht authentifizieren!'
              this.counter = 0;
            }
          
          );
        }
      }
    }
    
    if (this.counter == 0)
    {
      this.error = "Konto existiert nicht!"
    }
  }

  onSubmit() {
    
    this.error = "";
    this.submitted2 = true;

    if (!this.registerForm2.valid) {
      return false;
    } else {
      if (this.registerForm2.controls.password.value != this.registerForm2.controls.confPassword.value)
      {
        this.error = "Passwort ist falsch!";
      }
      else
      {
        this.ngxLoader.start();
        this.adminService.RegisterCust(this.registerForm2.value, this.image).subscribe(
          (res) => {
            console.log('Customer successfully registered!')
            if (res.status == 200)
            {
              this.ngxLoader.stop();
              this.check = this.check + 1;
              if (this.check == 1)
              {
                Swal.fire({
                  icon: 'success',
                  title: 'Bitte überprüfen Sie Ihre E-Mail-Adresse, um Ihre Registrierung abzuschließen!',
                  showConfirmButton: false,
                  timer: 3000
                })
                console.log('Customer successfully registered!')
                setTimeout(() => 
                {
                  window.location.reload();
                },
                3000);
              }
              this.ngOnDestroy();
            }
          }, (error) => {
            this.ngxLoader.stop();
            alert("Benutzername existiert bereits!");
            console.log(error);
            console.exception("ss");
          });
      }
    }
  }

  ngOnDestroy() { 
    if (this.unSubscriber)
    {
      this.unSubscriber.unsubscribe();
    }
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    window.location.reload();
  }
}
