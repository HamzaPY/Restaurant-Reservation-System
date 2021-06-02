import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from './../../service/restaurant.service';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-restaurant-dashboard',
  templateUrl: './restaurant-dashboard.component.html',
  styleUrls: ['./restaurant-dashboard.component.css']
})
export class RestaurantDashboardComponent implements OnInit {
  
  faSignOutAlt = faSignOutAlt;
  editForm: FormGroup;
  checker = false;
  Menu:any = [];
  Restaurants:any = [];
  Customers:any = [];
  restCategory:any = [];
  rest:any = [];
  restCustomers:any = [];
  showCustomers:any = [];
  shower = 0;
  nameLog = localStorage.getItem('loginName');
  constructor(private adminService: RestaurantService, private router: Router, private formBuilder: FormBuilder) { }

    ngOnInit() {
      this.readCustomers();
      this.editForm = this.formBuilder.group({
        rName: [''],
        rReserve: [false]
    });
    document.getElementById('reserveCheck') 
        .style.display = 'none'; 
    document.getElementById('mobReserveCheck') 
        .style.display = 'none'; 
    this.adminService.getMenu().subscribe((data) => {
      this.Menu = data;
      for (let i = 0; i < this.Menu.length; i++)
      {
        if (this.Menu[i].itemRest == this.nameLog)
        {
         for (let j = 0; j < this.Menu[i].itemCategory.length; j++)
         {
           this.restCategory.push(this.Menu[i].itemCategory[j]);
         }
         break;
        }
      }
     });

     this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      if (data)
      {
        this.hideloader();
        this.hideloader3();
      }
      for (let i = 0; i < this.Restaurants.length; i++)
      {
        if (this.Restaurants[i].name == this.nameLog)
        {
          this.rest.push(this.Restaurants[i]);
          break;
        }
      }
      this.checker = this.rest[0].reservations;
     });
  }

  readCustomers(){
    this.adminService.getCustomers().subscribe((data) => {
      this.Customers = data;
      if (data)
      {
        this.shower = 1;
        this.hideloader2();
        this.hideloader4();
      }
      if (this.Customers.length > 0)
      {
        for (let j = this.Customers.length - 1; j >= 0; j--)
        {
          if (this.Customers[j].restName == this.nameLog && this.Customers[j].status == "Pending")
          {
            this.showCustomers.push(this.Customers[j]);
          }
        }
      }
    });
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
    document.getElementById('reserveCheck') 
        .style.display = 'block'; 
  }  

  
  hideloader3() { 
    document.getElementById('loading3') 
        .style.display = 'none'; 
    document.getElementById('mobReserveCheck') 
        .style.display = 'block'; 
  }  

  hideloader2() { 
    document.getElementById('loading2') 
        .style.display = 'none'; 
  }  

  
  hideloader4() { 
    document.getElementById('loading4') 
        .style.display = 'none'; 
  }  

  onValueChange(value: boolean) {
    this.editForm.controls.rName.setValue(this.nameLog);
    this.editForm.controls.rReserve.setValue(value);

    document.getElementById('loading') 
    .style.display = 'block'; 
    document.getElementById('reserveCheck') 
    .style.display = 'none'; 
    document.getElementById('loading3') 
    .style.display = 'none'; 
    document.getElementById('mobReserveCheck') 
    .style.display = 'block'; 
    this.adminService.editReservation(this.editForm.value).subscribe(
      (res) => {
        console.log('Reservation updated successfully!')
        this.hideloader();
        this.hideloader3();
      }, (error) => {
        //alert(error);
        console.log(error);
        console.exception("ss");
    });
  }

  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }

}
