import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faUser, faClock , faCalendarAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare let $: any;
@Component({
  selector: 'app-customer-reservation',
  templateUrl: './customer-reservation.component.html',
  styleUrls: ['./customer-reservation.component.css']
})
export class CustomerReservationComponent implements OnInit {

  currCustomer = sessionStorage.getItem('custLogin');

  reserveN = sessionStorage.getItem('reserveName');
  reserveT = sessionStorage.getItem('reserveTime');
  reserveTb = sessionStorage.getItem('reserveTable');
  reserveD = sessionStorage.getItem('reserveDate');
  reserveRestEmail = '';
  reserveImg = '';
  reserveEmail = '';
  reserveFName = '';
  reserveLName = '';
  Restaurants:any = [];
  BookRest:any = [];
  Users:any = [];
  AllUsers:any = [];
  faUser = faUser;
  faClock = faClock;
  faCalendar = faCalendarAlt;
  faSignOutAlt = faSignOutAlt;
  registerForm: FormGroup;
  registerForm2: FormGroup;
  registerForm3: FormGroup;
  submitted = false;
  submitted2 = false;

  unSubscriber: Subscription;
  check = 0;
  registerForm4: FormGroup;
  submitted4 = false;
  image;

  counter = 0;
  public username: string;
  public password: string;
  public error: string;
  Users2:any = [];
  Customers2:any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private adminService: AdminService,
    private restService: RestaurantService,
    private ngxLoader: NgxUiLoaderService
  ) 
  { 
    this.readRestaurants();
    this.readUsers();
  }

  ngOnInit() {
    this.readUsers2();
    this.registerForm4 = this.formBuilder.group({
      imageFile: [null],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      confPassword: ['', Validators.required],
      termC: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      cReserveUser: [''],
      cFirst: ['', Validators.required],
      cLast: ['', Validators.required],
      cCont: ['', Validators.required],
      cEmail: ['', [Validators.required, Validators.email]],
      crName: [''],
      crDate: [''],
      crTime: [''],
      crTable: [''],
    });

    this.registerForm3 = this.formBuilder.group({
      notifyRest: [''],
      notifyCust: [''],
      notifyDate: [''],
      notifyHour: [''],
      notifyEmail: ['']
    });
  }

  get f2() { 
    return this.registerForm4.controls;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  readUsers2(){
    this.adminService.getUsers().subscribe((data) => {
     this.Users2 = data;

      for (let i = 0; i < this.Users2.length; i++)
      {
        if (this.Users2[i].admin == false && this.Users2[i].firstname != "")
        {
          this.Customers2.push(this.Users2[i]);
        }
      }
      //console.log(this.Customers);

    })
  }

  errorNull() {
    this.error = "";
  }  

  public submit() {

    this.error = "";
    this.counter = 0;
    for (let i = 0; i < this.Customers2.length; i++)
    {
      if (this.Customers2[i].username == this.username)
      {
        if (this.Customers2[i].emailVerify == false)
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

  onSubmit2() {
    
    this.error = "";
    this.submitted4 = true;

    if (!this.registerForm4.valid) {
      return false;
    } else {
      if (this.registerForm4.controls.password.value != this.registerForm4.controls.confPassword.value)
      {
        this.error = "Passwort ist falsch!";
      }
      else
      {
        this.ngxLoader.start();
        this.adminService.RegisterCust(this.registerForm4.value, this.image).subscribe(
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

  readRestaurants() {
    this.restService.getRestaurant().subscribe((data) => {
    this.Restaurants = data;
    for (let i = 0; i < this.Restaurants.length; i++)
    {
      if (this.Restaurants[i].name == this.reserveN)
      {
        this.reserveRestEmail = this.Restaurants[i].email;
        this.reserveImg = this.Restaurants[i].image;
        break;
      }
    }
    });
  }

  readUsers(){
    this.adminService.getUsers().subscribe((data) => {
     this.AllUsers = data;

      for (let i = 0; i < this.AllUsers.length; i++)
      {
        this.Users.push(this.AllUsers[i]);
      }

      if (this.currCustomer != null)
      {
        for (let i = 0; i < this.Users.length; i++)
        {
          if (this.Users[i].admin == false && this.Users[i].firstname != "")
          {
            if (this.Users[i].username == sessionStorage.getItem('custLogin'))
            {
              this.registerForm.controls.cFirst.setValue(this.Users[i].firstname);
              this.registerForm.controls.cLast.setValue(this.Users[i].lastname);
              this.registerForm.controls.cEmail.setValue(this.Users[i].email);
              this.registerForm.controls.cReserveUser.setValue(this.Users[i]._id);
              break;
            }
          }
        }
      }
      if (this.currCustomer == null)
      {
        this.registerForm.controls.cReserveUser.setValue(null);
      }
    });
  }


  get f() { 
    return this.registerForm.controls;
  }

  onSubmit() {
    this.registerForm.controls.crName.setValue(this.reserveN);
    this.registerForm.controls.crDate.setValue(this.reserveD);
    this.registerForm.controls.crTime.setValue(this.reserveT);
    this.registerForm.controls.crTable.setValue(this.reserveTb);
    this.reserveEmail = this.registerForm.controls.cEmail.value;
    this.reserveFName = this.registerForm.controls.cFirst.value;
    this.reserveLName = this.registerForm.controls.cLast.value;

    this.registerForm3.controls.notifyRest.setValue(this.reserveN);
    this.registerForm3.controls.notifyHour.setValue(this.reserveT);
    this.registerForm3.controls.notifyDate.setValue(this.reserveD);
    this.registerForm3.controls.notifyCust.setValue(this.reserveFName +'·'+ this.reserveLName);
    this.registerForm3.controls.notifyEmail.setValue(this.reserveRestEmail);

    this.submitted = true;

    if (!this.registerForm.valid) {
      return false;
    } else {

      this.ngxLoader.start();
      this.restService.addCustomer(this.registerForm.value).subscribe(
        (res) => {
          console.log('Customer successfully created!')
          this.restService.notifyRestaurant(this.registerForm3.value).subscribe(
            (res) => {
              if (res.status == 200)
              {
                this.ngxLoader.stop();
                console.log('Mail successfully send!');
                Swal.fire({
                  icon: 'success',
                  title: 'Vielen Dank für die Tischreservierung! Eine Bestätigungs-E-Mail wird an Ihre E-Mail gesendet.',
                  showConfirmButton: false,
                  timer: 3500
                })
                console.log('Reservation successfully done!')
                setTimeout(() => 
                {
                  this.ngZone.run(() => this.router.navigateByUrl('/'))
                },
                3500);
              }
            }, (error) => {
              //alert(error);
              console.log(error);
              console.exception("ss");
          });
        }, (error) => {
          //alert(error);
          console.log(error);
          console.exception("ss");
        });
    }
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    this.router.navigateByUrl('/');
  }

}
