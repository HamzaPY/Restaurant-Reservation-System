import { Component, OnInit, NgZone } from '@angular/core';
import { RestaurantService } from './../../service/restaurant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSignOutAlt, faTintSlash } from '@fortawesome/free-solid-svg-icons';
import { faUser, faClock , faCalendarAlt, faCarrot } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-reservation-view',
  templateUrl: './reservation-view.component.html',
  styleUrls: ['./reservation-view.component.css']
})
export class ReservationViewComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;
  faClock = faClock;
  faCalendar = faCalendarAlt;
  faCarrot = faCarrot;
  Customers:any = [];
  Restaurants:any = [];
  readCust:any = [];
  showCust:any = [];
  showBooker = 0;
  shower = 0;
  nameLog = localStorage.getItem('loginName');
  custStatus = "";
  registerForm3: FormGroup;
  registerForm4: FormGroup;

  constructor(private adminService: RestaurantService, private router: Router, private formBuilder: FormBuilder, private ngxLoader: NgxUiLoaderService) {
    this.readRestaurants();
    this.readCustomers();
   }

  ngOnInit() {
    this.registerForm3 = this.formBuilder.group({
      notifyRest: [''],
      notifyCust: [''],
      notifyDate: [''],
      notifyHour: [''],
      notifyEmail: [''],
      notifyStatus: ['']
    });

    this.registerForm4 = this.formBuilder.group({
      rName: [''],
      rBooking: [0]
    });
  }

  
  readRestaurants(){
    this.adminService.getRestaurant().subscribe((data) => {
      this.Restaurants = data;
      for (let k = 0; k < this.Restaurants.length; k++)
      {
        if (this.Restaurants[k].name == this.nameLog)
        {
          this.showBooker = this.Restaurants[k].bookings;
          break;
        }
      }
    });
  }

  readCustomers(){
    this.adminService.getCustomers().subscribe((data) => {
      this.Customers = data;
      if (data)
      {
        this.shower = 1;
        this.hideloader();
        this.hideloader2();
      }
      if (this.Customers.length > 0)
      {
        for (let j = this.Customers.length - 1; j >= 0; j--)
        {
          if (this.Customers[j].restName == this.nameLog && this.Customers[j].status == "Pending")
          {
            this.showCust.push(this.Customers[j]);
          }
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


  accepted(id: string)
  {
    for (let i = 0; i < this.showCust.length; i++)
    {
      if (this.showCust[i]._id == id)
      {
        this.registerForm3.controls.notifyRest.setValue(this.nameLog);
        this.registerForm3.controls.notifyHour.setValue(this.showCust[i].timeReserve);
        this.registerForm3.controls.notifyDate.setValue(this.showCust[i].dateReserve);
        this.registerForm3.controls.notifyCust.setValue(this.showCust[i].firstname +'·'+ this.showCust[i].lastname);
        this.registerForm3.controls.notifyEmail.setValue(this.showCust[i].emailAddr);
        this.registerForm3.controls.notifyStatus.setValue("Accepted");
        break;
      }
    }

    this.ngxLoader.start();
    this.custStatus = "Accepted";

    this.adminService.updateStatus(id, this.custStatus)
    .subscribe(res => {
      this.adminService.notifyCustomer(this.registerForm3.value).subscribe(
        (res) => {
          if (res.status == 200)
          {
            console.log('Mail successfully send!');
            this.registerForm4.controls.rName.setValue(this.nameLog);
            let sendBooker = this.showBooker + 1;
            this.registerForm4.controls.rBooking.setValue(sendBooker);
            this.adminService.editBooking(this.registerForm4.value).subscribe(
              (res) => {
                this.ngxLoader.stop();
                console.log('Booking updated successfully!')
                Swal.fire({
                  icon: 'success',
                  title: 'Reservation Accepted!',
                  showConfirmButton: false,
                  timer: 2000
                })
                setTimeout(() => 
                {
                  window.location.reload();
                },
                2000);
              }, (error) => {
                //alert(error);
                console.log(error);
                console.exception("ss");
            });
          }
        }, (error) => {
          //alert(error);
          console.log(error);
          console.exception("ss");
      });
    }, (error) => {
      console.log(error)
    })
  }

  rejected(id: string)
  {
    for (let i = 0; i < this.showCust.length; i++)
    {
      if (this.showCust[i]._id == id)
      {
        this.registerForm3.controls.notifyRest.setValue(this.nameLog);
        this.registerForm3.controls.notifyHour.setValue(this.showCust[i].timeReserve);
        this.registerForm3.controls.notifyDate.setValue(this.showCust[i].dateReserve);
        this.registerForm3.controls.notifyCust.setValue(this.showCust[i].firstname +'·'+ this.showCust[i].lastname);
        this.registerForm3.controls.notifyEmail.setValue(this.showCust[i].emailAddr);
        this.registerForm3.controls.notifyStatus.setValue("Rejected");
        break;
      }
    }

    this.ngxLoader.start();
    this.custStatus = "Rejected";

    this.adminService.updateStatus(id, this.custStatus)
    .subscribe(res => {
      this.adminService.notifyCustomer(this.registerForm3.value).subscribe(
        (res) => {
          if (res.status == 200)
          {
            console.log('Mail successfully send!');
            this.ngxLoader.stop();
            Swal.fire({
              icon: 'error',
              title: 'Reservation Rejected!',
              showConfirmButton: false,
              timer: 2000
            })
            setTimeout(() => 
            {
              window.location.reload();
            },
            2000);
          }
        }, (error) => {
          //alert(error);
          console.log(error);
          console.exception("ss");
      });
    }, (error) => {
      console.log(error)
    })
  }

  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }

}
