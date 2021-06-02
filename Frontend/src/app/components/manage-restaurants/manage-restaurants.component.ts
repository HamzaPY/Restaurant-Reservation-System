import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-restaurants',
  templateUrl: './manage-restaurants.component.html',
  styleUrls: ['./manage-restaurants.component.css']
})
export class ManageRestaurantsComponent implements OnInit {

  Restaurants:any = [];
  shower = 0;
  faSignOutAlt = faSignOutAlt;

  constructor(private adminService: AdminService, private router: Router) {
    this.readRestaurant();
   }

  ngOnInit(): void {
  }

  
  readRestaurant(){ 
    this.adminService.getRestaurant().subscribe((data) => {
      if (data)
      {
        this.hideloader();
        this.shower = 1;
      }
      console.log(data) 
     this.Restaurants = data;
    })
  }

  hideloader() { 
    document.getElementById('loading') 
        .style.display = 'none'; 
  }  

  removeEmployee(id, name) {
    if(window.confirm('Are you sure?')) {
      this.adminService.deleteRestaurant(id, name).subscribe((res) => {
          window.location.reload();
       },
       err => {
         console.error(err)
       })  
    }
  }


  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }

}
