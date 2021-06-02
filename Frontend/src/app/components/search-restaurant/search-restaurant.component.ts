import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService, searchData } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faPhoneAlt, faCarrot, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { faAngleRight, faAngleLeft, faMapMarkerAlt, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-search-restaurant',
  templateUrl: './search-restaurant.component.html',
  styleUrls: ['./search-restaurant.component.css']
})
export class SearchRestaurantComponent implements OnInit {

  currCustomer = sessionStorage.getItem('custLogin');
  
  latitude: number;
  longitude: number;
  zoom: number;
  currAddress: string;
  private geoCoder;
  @ViewChild('search2')
  public search2ElementRef: ElementRef;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  currentState = '';
  currentCountry = '';
  currentCity = '';
  registerForm: FormGroup;
  submitted = false;
  loc: searchData;
  currentDate = new Date();
  curriDate = new Date();
  currHours = this.curriDate.getHours() + 1;
  showHours = this.currHours + ':00';
  
  times = [];
  tables = ['2','3','4','5','6'];
  searcher: searchData = {
    searchLoc: '',
    searchTime: this.showHours,
    searchDate: '',
    searchTables: '1'
  };

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

  dayReserve = 0;
  timeReserve = '';
  number = '';
  restNumber = '';
  number2 = 0;
  restNumber2 = '';
  eNumber = 0;
  daySelect = -1;
  timerBox:any = [];
  combiner = '';
  shower = 0;

  Cuisine = [{ id: 1, name: "Fastfood" }, { id: 2, name: "Türkisch" }, { id: 3, name: "Orientalisch" }, 
  { id: 4, name: "Bar" }, { id: 5, name: "Arabisch" }, { id: 6, name: "Amerikanisch" },
  { id: 7, name: "Chinesisch" }, { id: 8, name: "Französisch" }, { id: 9, name: "Deutsch" }, 
  { id: 10, name: "Italienisch" }, { id: 11, name: "Spanisch" }, { id: 12, name: "Dessert" }];
  checkedCuisine = [];
  Restaurants:any = [];
  showRest:any = [];
  showCusine:any = [];
  faPhoneAlt = faPhoneAlt;
  faCarrot = faCarrot;
  faMoneyBill = faMoneyBill;
  currTime = localStorage.getItem('sTime');
  currTable = localStorage.getItem('sTable');
  currDate = localStorage.getItem('sDate');
  currState = localStorage.getItem('stateLoc');
  currCountry = localStorage.getItem('countryLoc');
  currCity = localStorage.getItem('cityLoc');

  faSignOutAlt = faSignOutAlt;
  faArrowCircleRight = faAngleRight;
  faArrowCircleLeft = faAngleLeft;
  faMapMarker = faMapMarkerAlt;
  faChartLine = faChartLine;
  colorTheme = 'theme-red';
 
  bsConfig: Partial<BsDatepickerConfig>;

  config: any;
  config2: any;

  public responsive: boolean = true;
  public labels: any = {
      previousLabel: ' < ',
      nextLabel: ' > ',
  };
 
  applyTheme() {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
  }

  constructor(private adminService: AdminService, private router: Router, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService) {
    this.mapsAPILoader = mapsAPILoader;
    this.ngZone = ngZone;
    this.applyTheme();
    this.readRestaurantLocation();
    
   }

   pageChangedRest(event){
    if (this.showRest.length > 0)
    {
      this.config2.currentPage = event;
    }
    if (this.showCusine.length > 0)
    {
      this.config.currentPage = event;
    }
  }

  ngOnInit() {

    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      document.getElementById("searcherTextBox").style.paddingRight = '0px';
      document.getElementById("buttonEdgeSearch").style.display = "none";
      document.getElementById("buttonFoxSearch").style.display = "block";
    }
    else {
      document.getElementById("buttonEdgeSearch").style.display = "block";
      document.getElementById("buttonFoxSearch").style.display = "none";
    }

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
    this.reservingTime();
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.showCusine.length
    };
    this.config2 = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.showRest.length
    };

    this.currentCity = sessionStorage.getItem('currCityLoc');
    this.currentState = sessionStorage.getItem('currStateLoc');
    this.currentCountry = sessionStorage.getItem('currCountryLoc');
    localStorage.removeItem('stateLoc');
    localStorage.removeItem('cityLoc');
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.search2ElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          let address = place.address_components;
          
          for(let element of address) {
      
            if (element['types'].indexOf('street_number') > -1) {
              localStorage.setItem('streetLoc', element['long_name']);
              continue;
            }
            if (element['types'].indexOf('route') > -1) {
              localStorage.setItem('routeLoc', element['long_name']);
              continue;
            }
            if (element['types'].indexOf('locality') > -1) {
              localStorage.setItem('cityLoc', element['long_name']);
              continue;
            }
            if (element['types'].indexOf('administrative_area_level_1') > -1) {
              localStorage.setItem('stateLoc', element['long_name']);
              continue;
            }
            if (element['types'].indexOf('country') > -1) {
              localStorage.setItem('countryLoc', element['long_name']);
              continue;
            }
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

            //load Places Autocomplete
            this.mapsAPILoader.load().then(() => {
              this.geoCoder = new google.maps.Geocoder;
        
              let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
              autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                  //get the place result
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        
                  //verify result
                  if (place.geometry === undefined || place.geometry === null) {
                    return;
                  }
        
                  localStorage.removeItem('cityLoc');
                  localStorage.removeItem('stateLoc');
                  localStorage.removeItem('countryLoc');
                  //set latitude, longitude and zoom
                  let address = place.address_components;
                  
                  for(let element of address) {
              
                    if (element['types'].indexOf('street_number') > -1) {
                      localStorage.setItem('streetLoc', element['long_name']);
                      continue;
                    }
                    if (element['types'].indexOf('route') > -1) {
                      localStorage.setItem('routeLoc', element['long_name']);
                      continue;
                    }
                    if (element['types'].indexOf('locality') > -1) {
                      localStorage.setItem('cityLoc', element['long_name']);
                      continue;
                    }
                    if (element['types'].indexOf('administrative_area_level_1') > -1) {
                      localStorage.setItem('stateLoc', element['long_name']);
                      continue;
                    }
                    if (element['types'].indexOf('country') > -1) {
                      localStorage.setItem('countryLoc', element['long_name']);
                      continue;
                    }
                  }
                  this.latitude = place.geometry.location.lat();
                  this.longitude = place.geometry.location.lng();
                  this.zoom = 12;
                });
              });
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

  reservingTime() {
    const prevDate = new Date(this.currentDate);
    let newDate1 = formatDate(prevDate, 'dd-MMM-yyyy', 'en');
    const nextDate = new Date(this.curriDate);
    let newDate2 = formatDate(nextDate, 'dd-MMM-yyyy', 'en');
    console.log(newDate1, newDate2);
    if (newDate1 == newDate2)
    {
      let hour = this.currHours;
      if (this.currHours < 8)
      {
        this.searcher.searchTime = '08' + ':00';
        let hour = 8;
        this.times = [];
        for (let i = 0; i < 30; i++)
        {
          if (hour == 24)
          {
            break;
          }
          if (hour <= 9)
          {
            this.times.push('0'+hour + ':00')
          }
          else
          {
            this.times.push(hour + ':00')
          }
          hour = hour + 1;
        }
      }
      else 
      {
        this.times = [];
        if (hour == 24)
        {
          this.searcher.searchTime = '00' + ':00';
          this.times.push('00' + ':00')
        }
        for (let i = 0; i < 30; i++)
        {
          if (hour == 24)
          {
            break;
          }
          if (hour <= 9)
          {
            this.times.push('0'+hour + ':00')
          }
          else
          {
            this.times.push(hour + ':00')
          }
          hour = hour + 1;
        }
      }
    }
    else
    {
      let hour = 8;
      this.times = [];
      for (let i = 0; i < 30; i++)
      {
        if (hour == 24)
        {
          break;
        }
        if (hour <= 9)
        {
          this.times.push('0'+hour + ':00')
        }
        else
        {
          this.times.push(hour + ':00')
        }
        hour = hour + 1;
      }
    }
  }

  custReserve(namer: string, timer: string) {
    sessionStorage.setItem('reserveName', namer);
    sessionStorage.setItem('reserveTime', timer);
    sessionStorage.setItem('reserveTable', localStorage.getItem('sTable'));
    sessionStorage.setItem('reserveDate', localStorage.getItem('sDate'));
    this.ngZone.run(() => this.router.navigateByUrl('/custReservation'));
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
  }  

  hideloader2() { 
    document.getElementById('loading2') 
        .style.display = 'none'; 
  }  


  readRestaurantLocation(){
    this.adminService.getRestaurant().subscribe((data) => {
     this.Restaurants = data;
     if (data)
     {
       this.hideloader();
       this.hideloader2();
       this.shower = 1;
     }
     
     this.timeReserve = localStorage.getItem('sTime');
     //console.log(this.timeReserve);
     this.number = this.timeReserve[0] + this.timeReserve[1];
     this.number2 = parseInt(this.number);
     //console.log(this.number2);
     this.eNumber = this.number2 + 2;
     this.timerBox = [];

     this.combiner = this.number2 + ':00';
     this.timerBox.push(this.combiner);
     this.combiner = this.number2 + ':30';
     this.timerBox.push(this.combiner);
     this.combiner = this.number2 + 1 + ':00';
     this.timerBox.push(this.combiner);
     this.combiner = this.number2 + 1 + ':30';
     this.timerBox.push(this.combiner);
     this.combiner = this.eNumber + ':00';
     this.timerBox.push(this.combiner);

     //console.log(this.timerBox);

     for (let i = 0; i < this.Restaurants.length; i++)
     {
        this.daySelect = -1;
        for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
        {
          if (parseInt(localStorage.getItem('sDay')) == 0)
          {
            if (this.Restaurants[i].openingDays[j] == 'Sonntag')
            {
              this.daySelect = j;
              break;
            }
          }
          if (parseInt(localStorage.getItem('sDay')) == 1)
          {
            if (this.Restaurants[i].openingDays[j] == 'Montag')
            {
              this.daySelect = j;
              break;
            }
          }
          if (parseInt(localStorage.getItem('sDay')) == 2)
          {
            if (this.Restaurants[i].openingDays[j] == 'Dienstag')
            {
              this.daySelect = j;
              break;
            }
          }
          if (parseInt(localStorage.getItem('sDay')) == 3)
          {
            if (this.Restaurants[i].openingDays[j] == 'Mittoch')
            {
              this.daySelect = j;
              break;
            }
          }
          if (parseInt(localStorage.getItem('sDay')) == 4)
          {
            if (this.Restaurants[i].openingDays[j] == 'Donnerstag')
            {
              this.daySelect = j;
              break;
            }
          }
          if (parseInt(localStorage.getItem('sDay')) == 5)
          {
            if (this.Restaurants[i].openingDays[j] == 'Freitag')
            {
              this.daySelect = j;
              break;
            }
          }
          if (parseInt(localStorage.getItem('sDay')) == 6)
          {
            if (this.Restaurants[i].openingDays[j] == 'Samstag')
            {
              this.daySelect = j;
              break;
            }
          }
        }

        //console.log('day' + this.daySelect);
        if (this.daySelect != -1 && this.Restaurants[i].reservations == true)
        {
          this.restNumber = this.Restaurants[i].startTime[this.daySelect][0] + this.Restaurants[i].startTime[this.daySelect][1]; 
          if (this.number2 >= parseInt(this.restNumber) && this.Restaurants[i].reservations == true)
          {
            //console.log(parseInt(this.restNumber));
            //console.log(this.number2);
            this.restNumber2 = this.Restaurants[i].endTime[this.daySelect][0] + this.Restaurants[i].endTime[this.daySelect][1];
            if (parseInt(this.restNumber2) > this.eNumber)
            {
              this.Restaurants[i].timer = [];
              this.Restaurants[i].timer = this.timerBox;
            }
            if (parseInt(this.restNumber2) == this.eNumber)
            {
              this.Restaurants[i].timer = [];
              this.Restaurants[i].timer.push(this.timerBox[0])
              this.Restaurants[i].timer.push(this.timerBox[1])
              this.Restaurants[i].timer.push(this.timerBox[2])
              this.Restaurants[i].timer.push(this.timerBox[3])
            }
            if (this.eNumber - parseInt(this.restNumber2) == 1)
            {
              this.Restaurants[i].timer = [];
              this.Restaurants[i].timer.push(this.timerBox[0])
              this.Restaurants[i].timer.push(this.timerBox[1])
            }
            if (this.eNumber - parseInt(this.restNumber2) >= 2)
            {
              this.Restaurants[i].timer = [];
            }

            console.log(this.currState, this.currCity, this.currCountry);

            if (this.currState == null && this.currCity == null)
            {
              if (this.Restaurants[i].country == this.currCountry)
              { 
                this.showRest.push(this.Restaurants[i]);
              }
            }
            if (this.currCity == null)
            {
              if (this.Restaurants[i].state == this.currState && this.Restaurants[i].country == this.currCountry)
              { 
                this.showRest.push(this.Restaurants[i]);
              }
            }
            else
            { 
              if (this.Restaurants[i].city == this.currCity && this.Restaurants[i].country == this.currCountry)
              { 
                this.showRest.push(this.Restaurants[i]);
              }
            }
          }
          else
          {
            this.Restaurants[i].timer = [];
            if (this.currState == null && this.currCity == null)
            {
              if (this.Restaurants[i].country == this.currCountry)
              { 
                this.showRest.push(this.Restaurants[i]);
              }
            }
            if (this.currCity == null)
            {
              if (this.Restaurants[i].state == this.currState && this.Restaurants[i].country == this.currCountry)
              { 
                this.showRest.push(this.Restaurants[i]);
              }
            }
            else
            { 
              if (this.Restaurants[i].city == this.currCity && this.Restaurants[i].country == this.currCountry)
              { 
                this.showRest.push(this.Restaurants[i]);
              }
            }
          }
        }
        else
        {
          this.Restaurants[i].timer = [];
          if (this.currState == null && this.currCity == null)
          {
            if (this.Restaurants[i].country == this.currCountry)
            { 
              this.showRest.push(this.Restaurants[i]);
            }
          }
          if (this.currCity == null)
          {
            if (this.Restaurants[i].state == this.currState && this.Restaurants[i].country == this.currCountry)
            { 
              this.showRest.push(this.Restaurants[i]);
            }
          }
          else
          { 
            if (this.Restaurants[i].city == this.currCity && this.Restaurants[i].country == this.currCountry)
            { 
              this.showRest.push(this.Restaurants[i]);
            }
          }
        }
     }
     
     this.config2.currentPage = Math.floor(this.showRest.length / 5);
    })
  }

  readRestaurantCuisine(){
  for (let i = 0; i < this.checkedCuisine.length; i++)
  {
    for (let j = 0; j < this.Restaurants.length; j++)
    {
      if (this.Restaurants[j].category == this.checkedCuisine[i])
      {
        this.showCusine.push(this.Restaurants[j]);
      }
    }
  }
  this.config.currentPage = Math.floor(this.showCusine.length / 5);
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

searchRest() {
  const date = new Date(this.curriDate);
  this.dayReserve = date.getDay();
  this.searcher.searchDate = formatDate(date, 'dd-MMM-yyyy', 'en');
  localStorage.setItem('sTime', this.searcher.searchTime);
  localStorage.setItem('sTable', this.searcher.searchTables);
  localStorage.setItem('sDate', this.searcher.searchDate);
  localStorage.setItem('sDay', String(this.dayReserve));
  window.location.reload();
}


  readPrices(price: string) {
    this.showCusine = [];
    this.showRest = [];
    if (this.checkedCuisine.length != 0)
    {
      for (let i = 0; i < this.checkedCuisine.length; i++)
      {
        for (let j = 0; j < this.Restaurants.length; j++)
        {
          if (this.Restaurants[j].category == this.checkedCuisine[i] && this.Restaurants[j].price == price)
          {
            this.showCusine.push(this.Restaurants[j]);
          }
        }
      }
    }
    else
    {
      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.Restaurants[i].price == price)
        {
          this.showCusine.push(this.Restaurants[i]);
        }
      }
    }
    this.config.currentPage = Math.floor(this.showCusine.length / 5);
  }

  
  showloader() { 
    document.getElementById('loading') 
        .style.display = 'block'; 
  }  

  onCheck(evt) {
    if (!this.checkedCuisine.includes(evt)) {
      this.checkedCuisine.push(evt);
    } else {
      var index = this.checkedCuisine.indexOf(evt);
      if (index > -1) {
        this.checkedCuisine.splice(index, 1);
      }
    }
    this.showRest = [];
    this.showCusine = [];
    if (this.checkedCuisine.length == 0)
    {
      this.showloader();
      this.shower = 0;
      this.readRestaurantLocation();
    }
    console.log(this.checkedCuisine);
    this.readRestaurantCuisine();
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    this.router.navigateByUrl('/');
  }

}
