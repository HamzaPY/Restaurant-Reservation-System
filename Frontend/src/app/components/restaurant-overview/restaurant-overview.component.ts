import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, HostListener } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService, searchData } from './../../service/admin.service';
import { RestaurantService } from './../../service/restaurant.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleRight, faAngleLeft, faMapMarkerAlt, faChartLine, faPhoneAlt, faSignOutAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube, faTwitter, faLinkedin, faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { BsCurrentDateViewComponent } from 'ngx-bootstrap/datepicker/themes/bs/bs-current-date-view.component';
import { Lightbox } from 'ngx-lightbox';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-restaurant-overview',
  templateUrl: './restaurant-overview.component.html',
  styleUrls: ['./restaurant-overview.component.css']
})
export class RestaurantOverviewComponent implements OnInit {
  
  geocoder:any;
  public location:Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 8
  };
  @ViewChild(AgmMap) map: AgmMap;

  currCustomer = sessionStorage.getItem('custLogin');

  unSubscriber: Subscription;
  check = 0;
  registerForm4: FormGroup;
  submitted4 = false;
  image;

  moreItems = false;
  firstCate = '';
  storeCate = '';
  counter = 0;
  public username: string;
  public password: string;
  public error: string;
  Users:any = [];
  Customers2:any = [];
  CategoryMob:any = [];
  firstCateMob = '';
  storeCateMob = '';

  showDays:any = [];
  showStartHours:any = [];
  showEndHours:any = [];
  currRest:any = [];
  restTitleP = "";
  restCity = "";
  restCountry = "";
  restCuisine = "";
  restTheName = "";
  restDetails = "";
  restContact = "";
  restTheTime = "";
  restTheDate = "";
  restTheTable = "";
  restOpenDay = "";
  restOpenStart = "";
  restOpenEnd = "";
  restTheRating = 0;
  restTheFood = 0;
  restTheService = 0;
  restTheAmbience = 0;
  restTheValue = 0;

  restTheWeb = "";
  restTheFace = "";
  restTheInst = "";
  restTheYt = "";

  shower = 0;

  currRate = 1;
  foodRate = 1;
  serviceRate = 1;
  ambienceRate = 1;
  valueRate = 1;
  Customers:any = [];
  custImage = "";

  registerForm2: FormGroup;
  submitted2 = false;
  registerForm3: FormGroup;

  restTheStreet = "";
  restTheCity = "";
  restTheState = "";
  restTheCountry = "";

  restGallery:any = [];
  restMenu:any = [];
  restRating:any = [];
  Menu:any = [];
  Category:any = [];
  Items:any = [];
  Ratings:any = [];
  latitude: number;
  longitude: number;
  zoom: number;
  currAddress: string;
  private geoCoder;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  _albums = [];
  currentState = '';
  currentCountry = '';
  currentCity = '';
  showCurrent:any = [];
  showDelivery:any = [];
  sorter = [];
  cutVal = 0;
  showBooked:any = [];
  lenRest = 0;
  maxRest = -1;
  registerForm: FormGroup;
  submitted = false;
  loc: searchData;
  currentDate = new Date();
  currDate = new Date();
  currentDay = this.currDate.getDay();
  currHours = this.currDate.getHours() + 1;
  showHours = this.currHours + ':00';
  
  times = [];
  tables = ['2','3','4','5','6'];
  searcher: searchData = {
    searchLoc: '',
    searchTime: this.showHours,
    searchDate: '',
    searchTables: '1'
  };

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

  starter = 0;
  ender = 4;
  Restaurants:any = [];
  Restaurants2:any = [];
  faPhoneAlt = faPhoneAlt;
  faArrowCircleRight = faAngleRight;
  faArrowCircleLeft = faAngleLeft;
  faMapMarker = faMapMarkerAlt;
  faChartLine = faChartLine;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faYoutube = faYoutube;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faAndroid = faAndroid;
  faApple = faApple;
  faSignOutAlt = faSignOutAlt;
  faLink = faLink;
  colorTheme = 'theme-red';
 
  bsConfig: Partial<BsDatepickerConfig>;
 
  applyTheme() {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
  }

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private adminService: AdminService,
    private restService: RestaurantService,
    private mapsAPILoader: MapsAPILoader,
    private actRoute: ActivatedRoute,
    private _lightbox: Lightbox,
    private ngxLoader: NgxUiLoaderService
    )
    {
      this.mapsAPILoader = mapsAPILoader;
      this.ngZone = ngZone;
      this.mapsAPILoader.load().then(() => {
        this.geocoder = new google.maps.Geocoder();
      });
      this.applyTheme();
    }

  ngOnInit() {
    document.getElementById("gallery").style.marginTop = "-250px";
    this.ngxLoader.start();
    this.readUsers();
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
    this.registerForm2 = this.formBuilder.group({
      rRating: [0, Validators.required],
      rFood: [0, Validators.required],
      rService: [0, Validators.required],
      rAmbience: [0, Validators.required],
      rValue: [0, Validators.required],
      rComment: ['', Validators.required],
      rUserDate: [''],
      rRestName: [''],
      rRateUser: ['']
    });
    this.registerForm3 = this.formBuilder.group({
      rRating: [0],
      rFood: [0],
      rService: [0],
      rAmbience: [0],
      rValue: [0],
      rName: [''],
    });
    this.reservingTime();
    this.currentCity = sessionStorage.getItem('currCityLoc');
    this.currentState = sessionStorage.getItem('currStateLoc');
    this.currentCountry = sessionStorage.getItem('currCountryLoc');
    localStorage.removeItem('stateLoc');
    localStorage.removeItem('cityLoc');
    localStorage.setItem('countryLoc', this.currentCountry);

    this.readRestaurant();
    this.readCustomers();
  }

  goToMaps() {
    window.location.href = "https://maps.google.com/maps?q=loc:"+this.restTheStreet+','+this.restTheCity+','+this.restTheState+','+this.restTheCountry;
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._albums, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
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

  readUsers(){
    this.adminService.getUsers().subscribe((data) => {
     this.Users = data;

      for (let i = 0; i < this.Users.length; i++)
      {
        if (this.Users[i].admin == false && this.Users[i].firstname != "")
        {
          this.Customers2.push(this.Users[i]);
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

  onSubmit() {
    
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

  get f() { 
    return this.registerForm2.controls;
  }
  
  readCustomers(){
    this.restService.getUsers().subscribe((data) => {
      this.Customers = data;
      for (let z = 0; z < this.Customers.length; z++)
      {
        if (this.Customers[z].username == this.currCustomer)
        {
          this.custImage = this.Customers[z].profilePic;
        }
      }
    });
  }

  onSubmit2() {
    this.submitted2 = true;

    console.log(this.currRate);
    this.registerForm2.controls.rRating.setValue(this.currRate);
    this.registerForm2.controls.rFood.setValue(this.foodRate);
    this.registerForm2.controls.rService.setValue(this.serviceRate);
    this.registerForm2.controls.rAmbience.setValue(this.ambienceRate);
    this.registerForm2.controls.rValue.setValue(this.valueRate);

    this.registerForm2.controls.rRestName.setValue(this.restTheName);
    if (this.currCustomer != null)
    {
      for (let i = 0; i < this.Users.length; i++)
      {
        if (this.Users[i].admin == false && this.Users[i].firstname != "")
        {
          if (this.Users[i].username == sessionStorage.getItem('custLogin'))
          {
            this.registerForm2.controls.rRateUser.setValue(this.Users[i]._id);
            break;
          }
        }
      }
    }

    let restaurantRate = 0;
    let restFood = 0;
    let restService = 0;
    let restAmbience = 0;
    let restValue = 0;

    if (this.restTheRating == 0)
    {
      restaurantRate = this.currRate;
    }
    else
    {
      var stars = [this.currRate, this.restTheRating];
      var total = 0;
      for(var i = 0; i < stars.length; i++) 
      {
         total = total + stars[i];
      }
      var avg = total / stars.length;
      
      restaurantRate = avg;
    }

    if (this.restTheFood == 0)
    {
      restFood = this.foodRate;
    }
    else
    {
      var stars = [this.foodRate, this.restTheFood];
      var total = 0;
      for(var i = 0; i < stars.length; i++) 
      {
         total = total + stars[i];
      }
      var avg = total / stars.length;
      
      restFood = avg;
    }

    if (this.restTheService == 0)
    {
      restService = this.serviceRate;
    }
    else
    {
      var stars = [this.serviceRate, this.restTheService];
      var total = 0;
      for(var i = 0; i < stars.length; i++) 
      {
         total = total + stars[i];
      }
      var avg = total / stars.length;
      
      restService = avg;
    }

    if (this.restTheAmbience == 0)
    {
      restAmbience = this.ambienceRate;
    }
    else
    {
      var stars = [this.ambienceRate, this.restTheAmbience];
      var total = 0;
      for(var i = 0; i < stars.length; i++) 
      {
         total = total + stars[i];
      }
      var avg = total / stars.length;
      
      restAmbience = avg;
    }

    if (this.restTheValue == 0)
    {
      restValue = this.valueRate;
    }
    else
    {
      var stars = [this.valueRate, this.restTheValue];
      var total = 0;
      for(var i = 0; i < stars.length; i++) 
      {
         total = total + stars[i];
      }
      var avg = total / stars.length;
      
      restValue = avg;
    }

    this.registerForm3.controls.rRating.setValue(restaurantRate);
    this.registerForm3.controls.rFood.setValue(restFood);
    this.registerForm3.controls.rService.setValue(restService);
    this.registerForm3.controls.rAmbience.setValue(restAmbience);
    this.registerForm3.controls.rValue.setValue(restValue);

    this.registerForm3.controls.rName.setValue(this.restTheName);

    const date = new Date(this.currDate);
    this.registerForm2.controls.rUserDate.setValue(formatDate(date, 'dd-MMM-yyyy', 'en'));

    if (!this.registerForm2.valid) {
      return false;
    } else {
    this.restService.addRating(this.registerForm2.value).subscribe(
      (res) => {
        console.log('Rating successfully added!')
        this.restService.editRating(this.registerForm3.value).subscribe(
          (res) => {
            console.log('Rating successfully updated!')
            window.location.reload();
            }, (error) => {
            console.log(error);
            console.exception("ss");
          });
        }, (error) => {
        console.log(error);
        console.exception("ss");
      });
    }
  }

 readRating() {
    this.restService.getRating().subscribe((data) => {
      this.Ratings = data;
      if (data)
      {
        this.shower = 1;
        this.hideloader3();
      }
      for (let i = 0; i < this.Ratings.length; i++)
      {
        if (this.Ratings[i].userTheRest == this.restTheName)
        {
          this.restRating.push(this.Ratings[i]);
        }
      }
      console.log(this.restRating);
    })
  }

  reservingTime() {
    const prevDate = new Date(this.currentDate);
    let newDate1 = formatDate(prevDate, 'dd-MMM-yyyy', 'en');
    const nextDate = new Date(this.currDate);
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
    this.triggerChange();
  }

  updateOnMap() {
    let full_address:string = this.restTheStreet || ""
    if (this.restTheCity) full_address = full_address + " " + this.restTheCity
    if (this.restTheState) full_address = full_address + " " + this.restTheState
    if (this.restTheCountry) full_address = full_address + " " + this.restTheCountry

    this.findLocation(full_address);
  }

  findLocation(address) {
    if (!this.geocoder) this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types

          if (types.indexOf('locality') != -1) {
            this.location.address_level_2 = results[0].address_components[i].long_name
          }
          if (types.indexOf('country') != -1) {
            this.location.address_country = results[0].address_components[i].long_name
          }
          if (types.indexOf('postal_code') != -1) {
            this.location.address_zip = results[0].address_components[i].long_name
          }
          if (types.indexOf('administrative_area_level_1') != -1) {
            this.location.address_state = results[0].address_components[i].long_name
          }
        }

        if (results[0].geometry.location) {
          this.location.lat = results[0].geometry.location.lat();
          this.location.lng = results[0].geometry.location.lng();
          this.location.marker.lat = results[0].geometry.location.lat();
          this.location.marker.lng = results[0].geometry.location.lng();
          this.location.marker.draggable = true;
          this.location.viewport = results[0].geometry.viewport;
        }
        
        this.map.triggerResize()
      } else {
        alert("Sorry, this search produced no results.");
      }
    })
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

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(e) {

      if (window.pageYOffset <= 500)
      {
        document.getElementById("gallery").style.marginTop = "-250px";
      }

      if (window.pageYOffset > 500)
      {
        document.getElementById("gallery").style.marginTop = "50px";
      }

      console.log(window.pageYOffset);

      if (this.restGallery.length <= 0 && this.restMenu.length <=0 && this.restRating.length <=0)
      {
        document.getElementById('activeOver') 
        .style.borderBottom = '2px solid white';
        document.getElementById('activeOver') 
            .style.fontWeight = '700';        

        document.getElementById('activeGall') 
            .style.borderBottom = 'none';
        document.getElementById('activeGall') 
            .style.fontWeight = '400';  

        document.getElementById('activeMenu') 
            .style.borderBottom = 'none';
        document.getElementById('activeMenu') 
            .style.fontWeight = '400';      

        document.getElementById('activeRat') 
            .style.borderBottom = 'none';
        document.getElementById('activeRat') 
            .style.fontWeight = '400';   

        document.getElementById('activeOverMob') 
        .style.borderBottom = '2px solid white';
        document.getElementById('activeOverMob') 
            .style.fontWeight = '700';        

        document.getElementById('activeGallMob') 
            .style.borderBottom = 'none';
        document.getElementById('activeGallMob') 
            .style.fontWeight = '400';  

        document.getElementById('activeMenuMob') 
            .style.borderBottom = 'none';
        document.getElementById('activeMenuMob') 
            .style.fontWeight = '400';      

        document.getElementById('activeRatMob') 
            .style.borderBottom = 'none';
        document.getElementById('activeRatMob') 
            .style.fontWeight = '400';     
      }
      else 
      {
        let sOverviewD = 500;
        let sGalleryD = document.getElementById("gallery").offsetHeight + 940;
        let sMenuD = document.getElementById("menu").offsetHeight + 1100;
        let sRatingD = 1900;

        if (window.pageYOffset > sOverviewD)
        {
          document.getElementById('activeOver') 
          .style.borderBottom = '2px solid white';
          document.getElementById('activeOver') 
              .style.fontWeight = '700';        
  
          document.getElementById('activeGall') 
              .style.borderBottom = 'none';
          document.getElementById('activeGall') 
              .style.fontWeight = '400';  
  
          document.getElementById('activeMenu') 
              .style.borderBottom = 'none';
          document.getElementById('activeMenu') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeRat') 
              .style.borderBottom = 'none';
          document.getElementById('activeRat') 
              .style.fontWeight = '400';                
        }
  
        if (window.pageYOffset > sGalleryD)
        {
          document.getElementById('activeOver') 
              .style.borderBottom = 'none';
          document.getElementById('activeOver') 
              .style.fontWeight = '400';        
  
          document.getElementById('activeGall') 
              .style.borderBottom = '2px solid white';
          document.getElementById('activeGall') 
              .style.fontWeight = '700';      
  
          document.getElementById('activeMenu') 
              .style.borderBottom = 'none';
          document.getElementById('activeMenu') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeRat') 
              .style.borderBottom = 'none';
          document.getElementById('activeRat') 
              .style.fontWeight = '400';                
        }
  
        if (window.pageYOffset > sMenuD)
        {
          document.getElementById('activeOver') 
              .style.borderBottom = 'none';
          document.getElementById('activeOver') 
              .style.fontWeight = '400';        
  
          document.getElementById('activeGall') 
              .style.borderBottom = 'none';
          document.getElementById('activeGall') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeMenu') 
              .style.borderBottom = '2px solid white';
          document.getElementById('activeMenu') 
              .style.fontWeight = '700';    
  
          document.getElementById('activeRat') 
              .style.borderBottom = 'none';
          document.getElementById('activeRat') 
              .style.fontWeight = '400';                
        }
  
        if (window.pageYOffset > sRatingD)
        {
          document.getElementById('activeOver') 
              .style.borderBottom = 'none';
          document.getElementById('activeOver') 
              .style.fontWeight = '400';        
  
          document.getElementById('activeGall') 
              .style.borderBottom = 'none';
          document.getElementById('activeGall') 
              .style.fontWeight = '00';      
  
          document.getElementById('activeMenu') 
              .style.borderBottom = 'none';
          document.getElementById('activeMenu') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeRat') 
              .style.borderBottom = '2px solid white';
          document.getElementById('activeRat') 
              .style.fontWeight = '700';                   
        }

        let sOverview = 315;
        let sGallery = document.getElementById("galleryMob").offsetHeight + 1050;
        let sMenu = document.getElementById("menuMob").offsetHeight + 1200;
        let sRating = 1700;

        if (window.pageYOffset > sOverview)
        {
          document.getElementById('activeOverMob') 
          .style.borderBottom = '2px solid white';
          document.getElementById('activeOverMob') 
              .style.fontWeight = '700';        
  
          document.getElementById('activeGallMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeGallMob') 
              .style.fontWeight = '400';  
  
          document.getElementById('activeMenuMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeMenuMob') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeRatMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeRatMob') 
              .style.fontWeight = '400';                
        }
  
        if (window.pageYOffset > sGallery)
        {
          document.getElementById('activeOverMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeOverMob') 
              .style.fontWeight = '400';        
  
          document.getElementById('activeGallMob') 
              .style.borderBottom = '2px solid white';
          document.getElementById('activeGallMob') 
              .style.fontWeight = '700';      
  
          document.getElementById('activeMenuMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeMenuMob') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeRatMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeRatMob') 
              .style.fontWeight = '400';                
        }
  
        if (window.pageYOffset > sMenu)
        {
          document.getElementById('activeOverMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeOverMob') 
              .style.fontWeight = '400';        
  
          document.getElementById('activeGallMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeGallMob') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeMenuMob') 
              .style.borderBottom = '2px solid white';
          document.getElementById('activeMenuMob') 
              .style.fontWeight = '700';    
  
          document.getElementById('activeRatMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeRatMob') 
              .style.fontWeight = '400';                
        }
  
        if (window.pageYOffset > sRating)
        {
          document.getElementById('activeOverMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeOverMob') 
              .style.fontWeight = '400';        
  
          document.getElementById('activeGallMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeGallMob') 
              .style.fontWeight = '00';      
  
          document.getElementById('activeMenuMob') 
              .style.borderBottom = 'none';
          document.getElementById('activeMenuMob') 
              .style.fontWeight = '400';      
  
          document.getElementById('activeRatMob') 
              .style.borderBottom = '2px solid white';
          document.getElementById('activeRatMob') 
              .style.fontWeight = '700';                   
        }
        console.log(sGallery, sMenu, sRating);
      }

       if (window.pageYOffset > 500) {
         let element = document.getElementById('overBox');
         element.classList.add('sticky');
         let element3 = document.getElementById('overBox');
         element3.style.backgroundColor = "rgba(139, 139, 139, 0.507)";
         let element2 = document.getElementById('theResBox');
         element2.classList.add('sticky2');
       } else {
        let element = document.getElementById('overBox');
          element.classList.remove('sticky'); 
        let element3 = document.getElementById('overBox');
         element3.style.backgroundColor = "rgba(212, 212, 212, 0.3)";
        let element2 = document.getElementById('theResBox');
          element2.classList.remove('sticky2');
       }

       if (window.pageYOffset > 315) {
        let element = document.getElementById('overBoxMob');
        element.classList.add('sticky');
        let element3 = document.getElementById('overBoxMob');
        element3.style.backgroundColor = "rgba(139, 139, 139, 0.507)";
      } else {
       let element = document.getElementById('overBoxMob');
         element.classList.remove('sticky'); 
       let element3 = document.getElementById('overBoxMob');
        element3.style.backgroundColor = "rgba(212, 212, 212, 0.3)";
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

    triggerChange() {
      document.getElementById('noOrderTime') 
      .style.display = 'none'; 
      document.getElementById('noOrderTimeMob') 
      .style.display = 'none'; 
      document.getElementById('orderTime') 
      .style.display = 'none'; 
      document.getElementById('orderTimeMob') 
      .style.display = 'none'; 
    }

  searchReservation() {
    const date = new Date(this.currDate);
    this.dayReserve = date.getDay();
    this.searcher.searchDate = formatDate(date, 'dd-MMM-yyyy', 'en');
    localStorage.setItem('sDay',String(this.dayReserve));

    document.getElementById('loading') 
    .style.display = 'block'; 
    document.getElementById('loading2') 
    .style.display = 'block'; 
    document.getElementById('noOrderTime') 
    .style.display = 'none'; 
    document.getElementById('noOrderTimeMob') 
    .style.display = 'none'; 
    document.getElementById('orderTime') 
    .style.display = 'none'; 
    document.getElementById('orderTimeMob') 
    .style.display = 'none'; 
    this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      let id = this.actRoute.snapshot.paramMap.get('id');

      this.timeReserve = this.searcher.searchTime;
      //console.log(this.timeReserve);
      this.number = this.timeReserve[0] + this.timeReserve[1];
      this.number2 = parseInt(this.number);
      //console.log(this.number2);
      this.eNumber = this.number2 + 2;
      this.timerBox = [];
      this.currRest = [];
 
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

      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.Restaurants[i]._id == id)
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
          if (this.daySelect != -1  && this.Restaurants[i].reservations == true)
          {
            this.restNumber = this.Restaurants[i].startTime[this.daySelect][0] + this.Restaurants[i].startTime[this.daySelect][1]; 
            if (this.number2 >= parseInt(this.restNumber)  && this.Restaurants[i].reservations == true)
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

              this.currRest.push(this.Restaurants[i]);
            }
            else
            {
              this.Restaurants[i].timer = [];
              this.currRest.push(this.Restaurants[i]);
            }
          }
          else
          {
            this.Restaurants[i].timer = [];
            this.currRest.push(this.Restaurants[i]);
          }

          if (this.Restaurants[i].timer.length <= 0)
          {
            this.hideloader();
            this.hideloader2();
            document.getElementById('noOrderTime') 
            .style.display = 'block'; 
            document.getElementById('noOrderTimeMob') 
            .style.display = 'block'; 
          }
          else
          {
            this.hideloader();
            this.hideloader2();
            document.getElementById('orderTime') 
            .style.display = 'block'; 
            document.getElementById('orderTimeMob') 
            .style.display = 'block'; 
            
          }
          break;
        }
      }

    });
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
  }  

  hideloader2() { 
    document.getElementById('loading2') 
        .style.display = 'none'; 
  } 

  hideloader3() { 
    document.getElementById('loading3') 
        .style.display = 'none'; 
  } 

  changingOver() {
    document.getElementById('activeOver') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeOver') 
        .style.fontWeight = '700';          

    document.getElementById('activeGall') 
        .style.borderBottom = 'none';
    document.getElementById('activeGall') 
        .style.fontWeight = '400';

    document.getElementById('activeMenu') 
        .style.borderBottom = 'none';
    document.getElementById('activeMenu') 
        .style.fontWeight = '400';    

    document.getElementById('activeRat') 
        .style.borderBottom = 'none';
    document.getElementById('activeRat') 
        .style.fontWeight = '400';        
  }

  changingOverMob() {
    document.getElementById('activeOverMob') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeOverMob') 
        .style.fontWeight = '700';          

    document.getElementById('activeGallMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeGallMob') 
        .style.fontWeight = '400';

    document.getElementById('activeMenuMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeMenuMob') 
        .style.fontWeight = '400';    

    document.getElementById('activeRatMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeRatMob') 
        .style.fontWeight = '400';        
  }

  changingGall() {
    document.getElementById('activeOver') 
        .style.borderBottom = 'none';
    document.getElementById('activeOver') 
        .style.fontWeight = '400';

    document.getElementById('activeGall') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeGall') 
        .style.fontWeight = '700';          

    document.getElementById('activeMenu') 
        .style.borderBottom = 'none';
    document.getElementById('activeMenu') 
        .style.fontWeight = '400';    

    document.getElementById('activeRat') 
        .style.borderBottom = 'none';
    document.getElementById('activeRat') 
        .style.fontWeight = '400';   
  }

  changingGallMob() {
    document.getElementById('activeOverMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeOverMob') 
        .style.fontWeight = '400';

    document.getElementById('activeGallMob') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeGallMob') 
        .style.fontWeight = '700';          

    document.getElementById('activeMenuMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeMenuMob') 
        .style.fontWeight = '400';    

    document.getElementById('activeRatMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeRatMob') 
        .style.fontWeight = '400';   
  }

  
  changingMenu() {
    document.getElementById('activeOver') 
        .style.borderBottom = 'none';
    document.getElementById('activeOver') 
        .style.fontWeight = '400';  

    document.getElementById('activeGall') 
        .style.borderBottom = 'none';
    document.getElementById('activeGall') 
        .style.fontWeight = '400';

    document.getElementById('activeMenu') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeMenu') 
        .style.fontWeight = '700';       

    document.getElementById('activeRat') 
        .style.borderBottom = 'none';
    document.getElementById('activeRat') 
        .style.fontWeight = '400';   
  }

  changingMenuMob() {
    document.getElementById('activeOverMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeOverMob') 
        .style.fontWeight = '400';  

    document.getElementById('activeGallMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeGallMob') 
        .style.fontWeight = '400';

    document.getElementById('activeMenuMob') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeMenuMob') 
        .style.fontWeight = '700';       

    document.getElementById('activeRatMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeRatMob') 
        .style.fontWeight = '400';   
  }
  
  changingRat() {
    document.getElementById('activeOver') 
        .style.borderBottom = 'none';
    document.getElementById('activeOver') 
        .style.fontWeight = '400';   

    document.getElementById('activeGall') 
        .style.borderBottom = 'none';
    document.getElementById('activeGall') 
        .style.fontWeight = '400';

    document.getElementById('activeMenu') 
        .style.borderBottom = 'none';
    document.getElementById('activeMenu') 
        .style.fontWeight = '400';    

    document.getElementById('activeRat') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeRat') 
        .style.fontWeight = '700';       
  }

  changingRatMob() {
    document.getElementById('activeOverMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeOverMob') 
        .style.fontWeight = '400';   

    document.getElementById('activeGallMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeGallMob') 
        .style.fontWeight = '400';

    document.getElementById('activeMenuMob') 
        .style.borderBottom = 'none';
    document.getElementById('activeMenuMob') 
        .style.fontWeight = '400';    

    document.getElementById('activeRatMob') 
        .style.borderBottom = '2px solid white';
    document.getElementById('activeRatMob') 
        .style.fontWeight = '700';       
  }

  custReserve(namer: string, timer: string) {

    sessionStorage.setItem('reserveName', namer);
    sessionStorage.setItem('reserveTime', timer);
    sessionStorage.setItem('reserveTable', this.searcher.searchTables);
    const date = new Date(this.currDate);
    let newDate = formatDate(date, 'dd-MMM-yyyy', 'en');
    sessionStorage.setItem('reserveDate', newDate);
    this.ngZone.run(() => this.router.navigateByUrl('/custReservation'));
  }

  readMenuItems() {
    this.restService.getMenu().subscribe((data) => {
      this.Menu = data;
      for (let i = 0; i < this.Menu.length; i++)
      {
        if (this.Menu[i].itemRest == this.restTheName)
        {
          this.restMenu = this.Menu[i];
          break;
        }
      }
      for (let j = 0; j < this.restMenu.itemCategory.length; j++)
      {
        if (this.restMenu.itemCategory[j].items.length > 0)
        {
          this.Category.push(this.restMenu.itemCategory[j]);
          this.CategoryMob.push(this.restMenu.itemCategory[j].name+'Mob');
        }
      }
      if (this.Category.length > 0)
      {
        this.storeCate = this.Category[0].name;
        this.firstCate = this.Category[0].name;

        this.storeCateMob = this.CategoryMob[0];
        this.firstCateMob = this.CategoryMob[0];

        this.Category.shift();
        this.CategoryMob.shift();
        this.Items = [];
        for (let i = 0; i < this.restMenu.itemCategory.length; i++)
        {
          if (this.restMenu.itemCategory[i].name == this.storeCate)
          {
            if (this.restMenu.itemCategory[i].items.length > 0)
            {
              for (let j = 0; j < this.restMenu.itemCategory[i].items.length; j++)
              {
                this.Items.push(this.restMenu.itemCategory[i].items[j]);
              }
            }
            break;
          }
        }
      }
    })
  }

  readCurrItem(cate: string) {
    document.getElementById(this.storeCate) 
    .style.borderColor = 'rgb(214, 214, 214)';
    document.getElementById(cate) 
    .style.borderColor = '#da3743';
    this.storeCate = cate;
    this.Items = [];
    for (let i = 0; i < this.restMenu.itemCategory.length; i++)
    {
      if (this.restMenu.itemCategory[i].name == cate)
      {
        if (this.restMenu.itemCategory[i].items.length > 0)
        {
          for (let j = 0; j < this.restMenu.itemCategory[i].items.length; j++)
          {
            this.Items.push(this.restMenu.itemCategory[i].items[j]);
          }
        }
        break;
      }
    }
  }

  readCurrItemMob(cateMob: string, cate: string) {
    document.getElementById(this.storeCateMob) 
    .style.borderColor = 'rgb(214, 214, 214)';
    document.getElementById(cateMob) 
    .style.borderColor = '#da3743';
    this.storeCateMob = cateMob;
    this.Items = [];
    for (let i = 0; i < this.restMenu.itemCategory.length; i++)
    {
      if (this.restMenu.itemCategory[i].name == cate)
      {
        if (this.restMenu.itemCategory[i].items.length > 0)
        {
          for (let j = 0; j < this.restMenu.itemCategory[i].items.length; j++)
          {
            this.Items.push(this.restMenu.itemCategory[i].items[j]);
          }
        }
        break;
      }
    }
  }

  readMoreItems() {
    this.moreItems = true;
  }

  readLessItems() {
    this.moreItems = false;
  }

  readRestaurant() {
    this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      if (data)
      {
        this.ngxLoader.stop();
        document.getElementById('contentOverview') 
        .style.display = 'block'; 
      }
      let id = this.actRoute.snapshot.paramMap.get('id');
      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.Restaurants[i]._id == id)
        {
          this.restTheName = this.Restaurants[i].name;
          this.restCity = this.Restaurants[i].city;
          this.restCountry = this.Restaurants[i].country;
          this.restCuisine = this.Restaurants[i].category;
          this.restContact = this.Restaurants[i].contact;
          this.restDetails = this.Restaurants[i].overview;
          this.restTitleP = this.Restaurants[i].titleImage;
          this.restTheStreet = this.Restaurants[i].street;
          this.restTheCity = this.Restaurants[i].city;
          this.restTheState = this.Restaurants[i].state;
          this.restTheCountry = this.Restaurants[i].country;
          this.restTheRating = this.Restaurants[i].rating;
          this.restTheFood = this.Restaurants[i].foodRating;
          this.restTheService = this.Restaurants[i].serviceRating;
          this.restTheAmbience = this.Restaurants[i].ambienceRating;
          this.restTheValue = this.Restaurants[i].valueRating;
          this.restTheWeb = this.Restaurants[i].website;
          this.restTheFace = this.Restaurants[i].facebook;
          this.restTheInst = this.Restaurants[i].instagram;
          this.restTheYt = this.Restaurants[i].youtube;

          this.updateOnMap();

          for (let j = 0; j<this.Restaurants[i].galleryImages.length; j++)
          {
            this.restGallery.push(this.Restaurants[i].galleryImages[j]);
          }
          this.readMenuItems();
          this.readRating();
          for (let k = 0; k < this.restGallery.length; k++) {
            const src = this.restGallery[k];
            const caption = 'Photo ' + k;
            const thumb = this.restGallery[k];
            const album = {
               src: src,
               caption: caption,
               thumb: thumb
            };
      
            this._albums.push(album);
          }

          for (let z = 0; z < this.Restaurants[i].openingDays.length; z++)
          {
            this.showDays.push(this.Restaurants[i].openingDays[z]);
            this.showStartHours.push(this.Restaurants[i].startTime[z]);
            this.showEndHours.push(this.Restaurants[i].endTime[z]);
          }


            if (this.currentDay == 1)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Montag")
                {
                  this.restOpenDay = "Montag";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Montag";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
            }
            if (this.currentDay == 2)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Dienstag")
                {
                  this.restOpenDay = "Dienstag";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Dienstag";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
            }
            if (this.currentDay == 3)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Mittoch")
                {
                  this.restOpenDay = "Mittoch";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Mittoch";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
            }
            if (this.currentDay == 4)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Donnerstag")
                {
                  this.restOpenDay = "Donnerstag";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Donnerstag";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
            }
            if (this.currentDay == 5)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Freitag")
                {
                  this.restOpenDay = "Freitag";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Freitag";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
            }
            if (this.currentDay == 6)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Samstag")
                {
                  this.restOpenDay = "Samstag";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Samstag";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
            }
            if (this.currentDay == 0)
            {
              for (let j = 0; j < this.Restaurants[i].openingDays.length; j++)
              {
                if (this.Restaurants[i].openingDays[j] == "Sonntag")
                {
                  this.restOpenDay = "Sonntag";
                  this.restOpenStart = this.Restaurants[i].startTime[j];
                  this.restOpenEnd = this.Restaurants[i].endTime[j];
                  break;
                }
                else
                {
                  this.restOpenDay = "Sonntag";
                  this.restOpenStart = "Geschlossen";
                  this.restOpenEnd = "";
                }
              }
           }
          break;
        }
      }
    });
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    this.router.navigateByUrl('/');
  }

}
