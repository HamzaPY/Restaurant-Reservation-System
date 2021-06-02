import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from './../../service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MapsAPILoader, AgmMap } from '@agm/core';
import Swal from "sweetalert2";


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
  selector: 'app-restaurant-edit',
  templateUrl: './restaurant-edit.component.html',
  styleUrls: ['./restaurant-edit.component.css']
})
export class RestaurantEditComponent implements OnInit {

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

  counter = 0;
  Restaurants:any = [];
  currEmail = '';
  faSignOutAlt = faSignOutAlt;
  editForm: FormGroup;
  submitted = false;
  category = ["Fastfood","Türkisch","Orientalisch","Bar","Arabisch","Amerikanisch","Chinesisch","Französisch","Deutsch","Italienisch","Spanisch","Dessert"];
  price = [{id: '€ (20€ and under)', val: '€'},{id: '€€ (21€ to 40€)', val: '€€'},{id: '€€€ (41€ to 60€)', val: '€€€'},{id: '€€€€ (61€ and over)', val: '€€€€'}];

  constructor (
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private adminService: AdminService,
    private mapsAPILoader: MapsAPILoader
    )
    {
      this.mapsAPILoader = mapsAPILoader;
      this.ngZone = ngZone;
      this.mapsAPILoader.load().then(() => {
        this.geocoder = new google.maps.Geocoder();
      });
    }

  ngOnInit() {
    this.location.marker.draggable = true;
    this.updateRestaurant();
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.getRestaurant(id);
    this.editForm = this.formBuilder.group({
      rName: ['', [Validators.required]],
      rOver: ['', [Validators.required]],
      rCont: ['', [Validators.required]],
      rCate: ['', [Validators.required]],
      rPrice: ['', [Validators.required]],
      rEmail: ['', [Validators.required]],
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: ['']
    })
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


  // Getter to access form control
  get f() {
    return this.editForm.controls;
  }

  getRestaurant(id) {
    this.adminService.getRest(id).subscribe(data => {
      this.currEmail = data['email'];
      this.editForm.setValue({
        rName: data['name'],
        rOver: data['overview'],
        rCont: data['contact'],
        rCate: data['category'],
        rPrice: data['price'],
        rEmail: data['email'],
        street: data['street'],
        city: data['city'],
        state: data['state'],
        country: data['country'],
        zipCode: data['zip']
      });
      this.location.address_level_1 = data['street'];
      this.location.address_level_2 = data['city'];
      this.location.address_state = data['state'];
      this.location.address_country = data['country'];
      this.location.address_zip = data['zip'];
    });
  }

  updateRestaurant() {
    this.editForm = this.formBuilder.group({
      rName: ['', [Validators.required]],
      rOver: ['', [Validators.required]],
      rCont: ['', [Validators.required]],
      rCate: ['', [Validators.required]],
      rPrice: ['', [Validators.required]],
      rEmail: ['', [Validators.required]],
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: ['']
    })
  }

  onSubmit() {

    this.editForm.controls.street.setValue(this.location.address_level_1);
    this.editForm.controls.city.setValue(this.location.address_level_2);
    this.editForm.controls.state.setValue(this.location.address_state);
    this.editForm.controls.country.setValue(this.location.address_country);
    this.editForm.controls.zipCode.setValue(this.location.address_zip);

    this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.editForm.get('rEmail').value == this.currEmail)
        {
          this.counter = 0;
          break;
        }
        if (this.Restaurants[i].email == this.editForm.get('rEmail').value)
        {
          this.counter = 1;
          break;
        }
      }
      if (this.counter == 1)
      {
        alert("Email already exists!")
        this.counter = 0;
      }
      else
      {
        this.submitted = true;
        if (!this.editForm.valid) {
          return false;
        } else {
            let id = this.actRoute.snapshot.paramMap.get('id');
            this.adminService.updateRestaurant(id, this.editForm.value)
              .subscribe(res => {
                Swal.fire({
                  icon: 'success',
                  title: 'Restaurant erfolgreich bearbeitet!',
                  showConfirmButton: false,
                  timer: 2000
                })
                console.log('Restaurant Edited Successfully!')
                setTimeout(() => 
                {
                  this.router.navigateByUrl('/manageRestaurant');
                },
                2000);
              }, (error) => {
                console.log(error)
              })
        }
      }
     });
  }

  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }

}
