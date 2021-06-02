import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faPhoneAlt, faCarrot, faMoneyBill, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-all-restaurants',
  templateUrl: './all-restaurants.component.html',
  styleUrls: ['./all-restaurants.component.css']
})
export class AllRestaurantsComponent implements OnInit {

  currCustomer = sessionStorage.getItem('custLogin');
  
  Restaurants:any = [];
  allRest:any = [];
  faPhoneAlt = faPhoneAlt;
  faSignOutAlt = faSignOutAlt;
  currFood = localStorage.getItem('currFood');
  currLocPlace = localStorage.getItem('currLocPlace');
  latitude: number;
  longitude: number;
  zoom: number;
  currAddress: string;
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  currentState = '';
  currentCountry = '';
  currentCity = '';
  shower = 0;

  unSubscriber: Subscription;
  check = 0;
  registerForm2: FormGroup;
  submitted2 = false;
  image;

  counter = 0;
  public username: string;
  public password: string;
  public error: string;
  Users:any = [];
  Customers:any = [];

  curriDate = new Date();
  currHours = this.curriDate.getHours() + 1;
  showHours = String(this.curriDate.getHours()) + ':00';

  constructor(private adminService: AdminService, private router: Router, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService) {
    this.mapsAPILoader = mapsAPILoader;
    if (localStorage.getItem('currFood') != null)
    {
      this.readFoodRestaurants();
    }
    if (localStorage.getItem('currLocPlace') != null)
    {
      this.readLocRestaurants();
    }
   }

  ngOnInit() {
    this.readUsers();
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
    localStorage.setItem('sDay',String(this.curriDate.getDay()));
    this.currentCity = sessionStorage.getItem('currCityLoc');
    this.currentState = sessionStorage.getItem('currStateLoc');
    this.currentCountry = sessionStorage.getItem('currCountryLoc');
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
  }  

  hideloader2() { 
    document.getElementById('loading2') 
        .style.display = 'none'; 
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

  readUsers(){
    this.adminService.getUsers().subscribe((data) => {
     this.Users = data;

      for (let i = 0; i < this.Users.length; i++)
      {
        if (this.Users[i].admin == false && this.Users[i].firstname != "")
        {
          this.Customers.push(this.Users[i]);
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
    for (let i = 0; i < this.Customers.length; i++)
    {
      if (this.Customers[i].username == this.username)
      {
        if (this.Customers[i].emailVerify == false)
        {
          this.counter = 1;
          this.error = "Bitte bestätigen sie ihre E-Mail Adresse"
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

  
setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 15;
      this.getAddress(this.latitude, this.longitude);
    });
  }
}

getAddress(latitude, longitude) {
  this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
    console.log(results);
    console.log(status);
    if (status === 'OK') {
      if (results[0]) {
        this.zoom = 12;
        let address = results[0].address_components;

        for(let element of address) {
          if (element.length == 0 && !element['types']) continue

          if (element['types'].indexOf('locality') > -1) {
            sessionStorage.setItem('currCityLoc', element['long_name']);
            continue;
          }

          if (element['types'].indexOf('administrative_area_level_1') > -1) {
            sessionStorage.setItem('currStateLoc', element['long_name']);
            continue;
          }

          if (element['types'].indexOf('country') > -1) {
            sessionStorage.setItem('currCountryLoc', element['long_name']);
            localStorage.setItem('countryLoc', element['long_name']);
            continue;
          }
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
    window.location.reload();
  });
}

  custReserve(namer: string, timer: string) {
    sessionStorage.setItem('reserveName', namer);
    sessionStorage.setItem('reserveTime', timer);
    sessionStorage.setItem('reserveTable', '1');
    const date = new Date(this.curriDate);
    let newDate = formatDate(date, 'dd-MMM-yyyy', 'en');
    sessionStorage.setItem('reserveDate', newDate);
    this.ngZone.run(() => this.router.navigateByUrl('/custReservation'));
  }

  readFoodRestaurants(){
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
      if (this.Restaurants[i].category == this.currFood)
      {
        this.allRest.push(this.Restaurants[i]);
        }
      }
    })
  }

  readLocRestaurants(){
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
        if (this.Restaurants[i].city == this.currLocPlace || this.Restaurants[i].state == this.currLocPlace)
        {
          this.allRest.push(this.Restaurants[i]);
        }
      }
    })
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    this.router.navigateByUrl('/');
  }

}
