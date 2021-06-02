import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faUser, faClock , faCalendarAlt, faSignOutAlt, faHotel, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

  currCustomer = sessionStorage.getItem('custLogin');
  custImage = "";
  currentUser = "";
  ratedRest:any = [];
  currentRating:any = [];
  allRating:any = [];
  reserveRest:any = [];
  currentReserve:any = [];
  allReserve:any = [];

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

  faCommentAlt = faCommentAlt;
  faHotel = faHotel;
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
  check2 = 0;
  registerForm4: FormGroup;
  submitted4 = false;
  image;
  image2;

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
    if (this.currCustomer == null)
    {
      this.router.navigateByUrl('/');
    }
    this.readUsers2();
    this.readRatings();
    this.readReserve();
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
      cImageFile: [null],
      cId: [''],
      cUsername: ['', Validators.required],
      cFirst: ['', Validators.required],
      cLast: ['', Validators.required],
      cEmail: ['', [Validators.required, Validators.email]],
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

  selectImage2(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.image2 = file2;
    }
  }

  goToRest(name: string) {
    for (let i = 0; i < this.Restaurants.length; i++)
    {
      if (this.Restaurants[i].name == name)
      {
        let go = this.Restaurants[i]._id;
        this.router.navigateByUrl(`/overviewRestaurant/${go}`);
        break;
      }
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

  readRatings(){
    this.restService.getRating().subscribe((data) => {
     this.ratedRest = data;

      for (let i = 0; i < this.ratedRest.length; i++)
      {
        if (this.ratedRest[i].rateUser != null)
        {
          if (this.ratedRest[i].rateUser.username == this.currCustomer)
          {
            this.allRating.push(this.ratedRest[i]);
          }
        }
      }

      let counting = 0;
      for (let j = this.allRating.length - 1; j >= 0; j--)
      {
        if (counting == 6)
        {
          break;
        }
        this.currentRating.push(this.allRating[j]);
        counting = counting + 1;
      }
    })
  }

  readReserve(){
    this.restService.getCustomers().subscribe((data) => {
     this.reserveRest = data;

      for (let i = 0; i < this.reserveRest.length; i++)
      {
        if (this.reserveRest[i].reserveUser != null)
        {
          if (this.reserveRest[i].reserveUser.username == this.currCustomer && this.reserveRest[i].status == "Accepted")
          {
            this.allReserve.push(this.reserveRest[i]);
          }
        }
      }

      let counting = 0;
      for (let j = this.allReserve.length - 1; j >= 0; j--)
      {
        if (counting == 6)
        {
          break;
        }
        this.currentReserve.push(this.allReserve[j]);
        counting = counting + 1;
      }
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
              this.registerForm.controls.cUsername.setValue(this.Users[i].username);
              this.registerForm.controls.cId.setValue(this.Users[i]._id);
              this.custImage = this.Users[i].profilePic;
              this.currentUser = this.registerForm.controls.cUsername.value;
              if (this.Users[i].verifyEmail == false)
              {
                alert("Überprüfen Sie Ihre E-Mail-Adresse, um auf Ihr Profil zuzugreifen");
                this.router.navigateByUrl('/');
              }
              break;
            }
          }
        }
      }
    });
  }


  get f() { 
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.registerForm.valid) {
      return false;
    } else {

      var counting = 0;
      if (this.registerForm.controls.cUsername.value != this.currentUser)
      {
        for (let i = 0; i < this.Users.length; i++)
        {
          if (this.Users[i].admin == false && this.Users[i].firstname != "")
          {
            if (this.Users[i].username == this.registerForm.controls.cUsername.value)
            {
              counting = 1;
              alert("Benutzername existiert bereits!");
              break;
            }
          }
        }
      }

      if (counting == 0)
      {
        this.ngxLoader.start();
        sessionStorage.setItem('custLogin', this.registerForm.controls.cUsername.value);
        this.unSubscriber = this.restService.editCustomer(this.registerForm.value, this.image2).subscribe(
        (res) => {
          if (res.status == 200)
          {
            this.ngxLoader.stop();
            this.check2 = this.check2 + 1;
  
            if (this.check2 == 1)
            {
              console.log('Customer successfully edited!')
              Swal.fire({
                icon: 'success',
                title: 'Kunde bearbeitet!',
                showConfirmButton: false,
                timer: 2000
              })
              setTimeout(() => 
              {
                this.ngZone.run(() => window.location.reload())
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
    }
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    this.router.navigateByUrl('/');
  }

}
