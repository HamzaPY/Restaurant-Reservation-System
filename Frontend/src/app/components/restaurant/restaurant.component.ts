import { Component, OnInit } from '@angular/core';
import { AdminService } from './../../service/admin.service';
import { RestaurantService } from './../../service/restaurant.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent {
  counter = 0;
  public username: string;
  public password: string;
  public error: string;
  Users:any = [];
  Restaurants:any = [];

  constructor(private auth: AdminService, private authRest: RestaurantService, private router: Router) {
    this.readUsers();
   }

   readUsers(){
    this.auth.getUsers().subscribe((data) => {
     this.Users = data;

      for (let i = 0; i < this.Users.length; i++)
      {
        if (this.Users[i].admin == false && this.Users[i].firstname == "")
        {
          this.Restaurants.push(this.Users[i]);
        }
      }
      //console.log(this.Restaurants);
    })
  }


  public submit() {

    for (let i = 0; i < this.Restaurants.length; i++)
    {
    
      if (this.Restaurants[i].username == this.username)
      {
        this.counter = 1;
        localStorage.setItem('loginName',this.username);
        this.authRest.login(this.username, this.password)
        .pipe(first())
        .subscribe(
       
          result => this.router.navigate(['restDashboard']),
          err => 
          {
            this.error = 'Konnte nicht authentifizieren!'
            this.counter = 0;
          }
         
        );
      }
    }
    
    if (this.counter == 0)
    {
      this.error = "Konto existiert nicht!"
    }
  } 
}
