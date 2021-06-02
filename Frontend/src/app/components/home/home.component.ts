import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService, searchData } from './../../service/admin.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { faAngleRight, faAngleLeft, faMapMarkerAlt, faChartLine, faSignOutAlt, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube, faTwitter, faLinkedin, faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { BsCurrentDateViewComponent } from 'ngx-bootstrap/datepicker/themes/bs/bs-current-date-view.component';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  latitude: number;
  longitude: number;
  zoom: number;
  currAddress: string;
  private geoCoder;
  @ViewChild('search3')
  public search3ElementRef: ElementRef;
  @ViewChild('search2')
  public search2ElementRef: ElementRef;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  currCustomer = sessionStorage.getItem('custLogin');

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

  showAll:any = [];

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

  defaultImage = './../../assets/img/defaultBack.jpg';
  locImage1 = "../../../assets/img/berlin.jpg";
  locImage2 = "../../../assets/img/munich.jpg";
  locImage3 = "../../../assets/img/hamburg.jpg";
  locImage4 = "../../../assets/img/koln.jpg";
  locImage5 = "../../../assets/img/frankfurt.jpg";
  locImage6 = "../../../assets/img/dusseldorf.jpg";

  foodImage1 = "../../../assets/img/cusi1.jpg";
  foodImage2 = "../../../assets/img/cusi2.jpg";
  foodImage3 = "../../../assets/img/cusi3.jpg";
  foodImage4 = "../../../assets/img/cusi4.jpg";
  foodImage5 = "../../../assets/img/cusi5.jpg";
  foodImage6 = "../../../assets/img/cusi6.jpg";
  foodImage7 = "../../../assets/img/cusi7.jpg";
  foodImage8 = "../../../assets/img/cusi8.jpg";
  foodImage9 = "../../../assets/img/cusi9.jpg";
  foodImage10 = "../../../assets/img/cusi10.jpg";
  foodImage11 = "../../../assets/img/cusi11.jpg";
  foodImage12 = "../../../assets/img/cusi12.jpg";

  dayReserve = 0;
  starter = 0;
  ender = 4;
  Restaurants:any = [];
  Restaurants2:any = [];
  faSignOutAlt = faSignOutAlt;
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
  faLocationArrow = faLocationArrow;
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
    private mapsAPILoader: MapsAPILoader,
    private ngxLoader: NgxUiLoaderService
    )
    {
      this.mapsAPILoader = mapsAPILoader;
      this.ngZone = ngZone;
      this.applyTheme();
    }

  ngOnInit() {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      document.getElementById("searcherEdge").style.display = "none";
      document.getElementById("searcherFox").style.display = "block";
      document.getElementById("buttonEdge").style.display = "none";
      document.getElementById("buttonFox").style.display = "block";
    }
    else {
      document.getElementById("searcherEdge").style.display = "block";
      document.getElementById("searcherFox").style.display = "none";
      document.getElementById("buttonEdge").style.display = "block";
      document.getElementById("buttonFox").style.display = "none";
    }
  

    this.ngxLoader.start();
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
    this.currentCity = sessionStorage.getItem('currCityLoc');
    this.currentState = sessionStorage.getItem('currStateLoc');
    this.currentCountry = sessionStorage.getItem('currCountryLoc');
    localStorage.removeItem('stateLoc');
    localStorage.removeItem('cityLoc');
    localStorage.setItem('countryLoc', this.currentCountry);
    this.readRestaurant();

            this.mapsAPILoader.load().then(() => {
          this.geoCoder = new google.maps.Geocoder;

          let autocomplete = new google.maps.places.Autocomplete(this.search3ElementRef.nativeElement);
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

              localStorage.removeItem('stateLoc');
              localStorage.removeItem('cityLoc');
              
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

              localStorage.removeItem('stateLoc');
              localStorage.removeItem('cityLoc');
              
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
    
              //set latitude, longitude and zoom
              let address = place.address_components;

              localStorage.removeItem('stateLoc');
              localStorage.removeItem('cityLoc');
              
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
    }

  selectCuisine(food: string)
  {
    localStorage.removeItem('currLocPlace');
    localStorage.setItem('currFood',food);
    this.ngZone.run(() => this.router.navigateByUrl('/allRestaurants'));
  }

  selectLocation(locPlace: string)
  {
    localStorage.removeItem('currFood');
    localStorage.setItem('currLocPlace',locPlace);
    this.ngZone.run(() => this.router.navigateByUrl('/allRestaurants'));
  }

  searchRest() {
    const date = new Date(this.currDate);
    this.dayReserve = date.getDay();
    this.searcher.searchDate = formatDate(date, 'dd-MMM-yyyy', 'en');
    localStorage.setItem('sTime', this.searcher.searchTime);
    localStorage.setItem('sTable', this.searcher.searchTables);
    localStorage.setItem('sDate', this.searcher.searchDate);
    localStorage.setItem('sDay', String(this.dayReserve));
    this.ngZone.run(() => this.router.navigateByUrl('/searchRestaurant'));
  }

  readRestaurant() {
    this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      if (data)
      {
        this.ngxLoader.stop();
      }
      this.lenRest = this.Restaurants.length;
      for (let i = 0; i < this.Restaurants.length; i++)
      {
        this.showAll.push(this.Restaurants[i]);
      }

      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.Restaurants[i].city == this.currentCity && this.Restaurants[i].country == this.currentCountry)
        {
          this.showCurrent.push(this.Restaurants[i]);
          this.sorter.push(this.Restaurants[i].bookings);
        }
        if (this.Restaurants[i].city == this.currentCity && this.Restaurants[i].country == this.currentCountry && this.Restaurants[i].delivery == true)
        {
          this.showDelivery.push(this.Restaurants[i]);
        }
      }

      if (this.showCurrent.length > 12)
      {
        for (let i = 0; i < 12; i++)
        {
          this.cutVal = this.sorter.indexOf(Math.max(...this.sorter));
          this.showBooked.push(this.showCurrent[this.cutVal]);
          this.sorter[this.cutVal] = -1;
        }
      }
      else
      {
        for (let i = 0; i < this.showCurrent.length; i++)
        {
          this.showBooked.push(this.showCurrent[i]);
        }
      }
    });
  }

  logout() {
    sessionStorage.removeItem('custLogin');
    window.location.reload();
  }

}