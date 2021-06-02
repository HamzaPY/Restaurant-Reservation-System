import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { Subscription } from 'rxjs';
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
  selector: 'app-restaurant-create',
  templateUrl: './restaurant-create.component.html',
  styleUrls: ['./restaurant-create.component.css']
})
export class RestaurantCreateComponent implements OnInit {

  unSubscriber: Subscription;
  check = 0;
  geocoder:any;
  public location:Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 5
  };
  @ViewChild(AgmMap) map: AgmMap;

  faSignOutAlt = faSignOutAlt;
  registerForm: FormGroup;
  submitted = false;
  image;
  image2;
  category = ["Fastfood","Türkisch","Orientalisch","Bar","Arabisch","Amerikanisch","Chinesisch","Französisch","Deutsch","Italienisch","Spanisch","Dessert"];
  price = [{id: '€ (20€ and under)', val: '€'},{id: '€€ (21€ to 40€)', val: '€€'},{id: '€€€ (41€ to 60€)', val: '€€€'},{id: '€€€€ (61€ and over)', val: '€€€€'}];
  openDays:any = [];
  openSTime:any = [];
  openETime:any = [];

  startTimeMon = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  startTimeTues = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  startTimeWed = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  startTimeThurs = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  startTimeFri = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  startTimeSat = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
  startTimeSun = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

  endTimeMon = [];
  endTimeTues = [];
  endTimeWed = [];
  endTimeThurs = [];
  endTimeFri = [];
  endTimeSat = [];
  endTimeSun = [];

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
      this.mapsAPILoader.load().then(() => {
        this.geocoder = new google.maps.Geocoder();
      });
    }

  ngOnInit() {
    this.onSelectMon('08:00');
    this.onSelectTues('08:00');
    this.onSelectWed('08:00');
    this.onSelectThurs('08:00');
    this.onSelectFri('08:00');
    this.onSelectSat('08:00');
    this.onSelectSun('08:00');

    this.location.marker.draggable = true;
      this.registerForm = this.formBuilder.group({
          imageFile: [null, Validators.required],
          imageFileTitle: [null, Validators.required],
          rName: ['', Validators.required],
          rOver: ['', Validators.required],
          rCont: ['', Validators.required],
          rWeb: [''],
          rFace: [''],
          rInst: [''],
          rYt: [''],
          rDel: [false],
          rCate: ['', Validators.required],
          rPrice: ['', Validators.required],
          rEmail: ['', Validators.required],
          rPass: ['', Validators.required],
          rMon: [''],
          rMonS: ['08:00', Validators.required],
          rMonE: ['23:00', Validators.required],
          rTue: [''],
          rTueS: ['08:00', Validators.required],
          rTueE: ['23:00', Validators.required],
          rWed: [''],
          rWedS: ['08:00', Validators.required],
          rWedE: ['23:00', Validators.required],
          rThur: [''],
          rThurS: ['08:00', Validators.required],
          rThurE: ['23:00', Validators.required],
          rFri: [''],
          rFriS: ['08:00', Validators.required],
          rFriE: ['23:00', Validators.required],
          rSat: [''],
          rSatS: ['08:00', Validators.required],
          rSatE: ['23:00', Validators.required],
          rSun: [''],
          rSunS: ['08:00', Validators.required],
          rSunE: ['23:00', Validators.required],
          street: [''],
          city: [''],
          state: [''],
          country: [''],
          zipCode: [''],
          rBook: 0
      });

  }

  onSelectMon(timeid) {
    this.endTimeMon = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeMon.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeMon.push(String(fTime) + ':00');
      }
    }
  }

  onSelectTues(timeid) {
    this.endTimeTues = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeTues.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeTues.push(String(fTime) + ':00');
      }
    }
  }

  onSelectWed(timeid) {
    this.endTimeWed = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeWed.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeWed.push(String(fTime) + ':00');
      }
    }
  }

  onSelectThurs(timeid) {
    this.endTimeThurs = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeThurs.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeThurs.push(String(fTime) + ':00');
      }
    }
  }

  onSelectFri(timeid) {
    this.endTimeFri = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeFri.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeFri.push(String(fTime) + ':00');
      }
    }
  }

  onSelectSat(timeid) {
    this.endTimeSat = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeSat.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeSat.push(String(fTime) + ':00');
      }
    }
  }

  onSelectSun(timeid) {
    this.endTimeSun = [];
    let sTime = timeid[0] + timeid[1];
    let fTime = parseInt(sTime);
    for (let y = 0; y < 30; y++)
    {
      if (fTime == 23)
      {
        break;
      }
      fTime = fTime + 1;
      if (fTime <= 9)
      {
        this.endTimeSun.push(String(timeid[0]+fTime) + ':00');
      }
      else
      {
        this.endTimeSun.push(String(fTime) + ':00');
      }
    }
  }

  updateOnMap() {
    let full_address:string = this.location.address_level_1 || ""
    if (this.location.address_level_2) full_address = full_address + " " + this.location.address_level_2
    if (this.location.address_state) full_address = full_address + " " + this.location.address_state
    if (this.location.address_country) full_address = full_address + " " + this.location.address_country

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

  markerDragEnd($event: google.maps.MouseEvent) {
    this.location.marker.lat = $event.latLng.lat();
    this.location.marker.lng = $event.latLng.lng();
    this.findAddressByCoordinates();
   }

   findAddressByCoordinates() {
    this.geocoder.geocode({
      'location': {
        lat: this.location.marker.lat,
        lng: this.location.marker.lng
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    })
  }

  decomposeAddressComponents(addressArray) {
    if (addressArray.length == 0) return false;
    let address = addressArray[0].address_components;

    for(let element of address) {
      if (element.length == 0 && !element['types']) continue

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
  }


  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  selectImage2(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image2 = file;
    }
  }

  get f() { 
    return this.registerForm.controls;
  }

  onSubmit() {

    this.registerForm.controls.street.setValue(this.location.address_level_1);
    this.registerForm.controls.city.setValue(this.location.address_level_2);
    this.registerForm.controls.state.setValue(this.location.address_state);
    this.registerForm.controls.country.setValue(this.location.address_country);
    this.registerForm.controls.zipCode.setValue(this.location.address_zip);

    if (this.location.address_country == undefined)
    {
      this.registerForm.controls.country.setValue("Germany");
    }

    if (this.registerForm.get('rMon').value == true)
    {
      this.openDays.push("Montag");
      this.openSTime.push(this.registerForm.get('rMonS').value);
      this.openETime.push(this.registerForm.get('rMonE').value);
    }
    if (this.registerForm.get('rTue').value == true)
    {
      this.openDays.push("Dienstag");
      this.openSTime.push(this.registerForm.get('rTueS').value);
      this.openETime.push(this.registerForm.get('rTueE').value);
    }
    if (this.registerForm.get('rWed').value == true)
    {
      this.openDays.push("Mittoch");
      this.openSTime.push(this.registerForm.get('rWedS').value);
      this.openETime.push(this.registerForm.get('rWedE').value);
    }
    if (this.registerForm.get('rThur').value == true)
    {
      this.openDays.push("Donnerstag");
      this.openSTime.push(this.registerForm.get('rThurS').value);
      this.openETime.push(this.registerForm.get('rThurE').value);
    }
    if (this.registerForm.get('rFri').value == true)
    {
      this.openDays.push("Freitag");
      this.openSTime.push(this.registerForm.get('rFriS').value);
      this.openETime.push(this.registerForm.get('rFriE').value);
    }
    if (this.registerForm.get('rSat').value == true)
    {
      this.openDays.push("Samstag");
      this.openSTime.push(this.registerForm.get('rSatS').value);
      this.openETime.push(this.registerForm.get('rSatE').value);
    }
    if (this.registerForm.get('rSun').value == true)
    {
      this.openDays.push("Sonntag");
      this.openSTime.push(this.registerForm.get('rSunS').value);
      this.openETime.push(this.registerForm.get('rSunE').value);
    }
   
    this.submitted = true;

    if (!this.registerForm.valid) {
      return false;
    } else {
      this.ngxLoader.start();
      this.unSubscriber = this.adminService.addRestaurant(this.registerForm.value, this.image, this.image2, this.openDays, this.openSTime, this.openETime).subscribe(
        (res) => {
          console.log('Restaurant successfully created!')
          if (res.status == 200)
          {
            this.ngxLoader.stop();
            this.check = this.check + 1;
            if (this.check == 1)
            {
              Swal.fire({
                icon: 'success',
                title: 'Restaurant erfolgreich hinzugefügt!',
                showConfirmButton: false,
                timer: 2000
              })
              console.log('Restaurant successfully created!')
              setTimeout(() => 
              {
                this.router.navigateByUrl('/adminDashboard');
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
