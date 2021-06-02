import { Component, OnInit } from '@angular/core';
import { AdminService } from './../../service/admin.service';
import { RestaurantService } from './../../service/restaurant.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  counter = 0;
  public username: string;
  public password: string;
  public error: string;
  Users:any = [];
  Admins:any = [];

  constructor(private auth: AdminService, private authRest: RestaurantService, private router: Router) {
    this.readUsers();
   }

   readUsers(){
    this.auth.getUsers().subscribe((data) => {
     this.Users = data;

      for (let i = 0; i < this.Users.length; i++)
      {
        if (this.Users[i].admin == true)
        {
          this.Admins.push(this.Users[i]);
        }
      }
      //console.log(this.Admins);
    })
  }


  public submit() {

    for (let i = 0; i < this.Admins.length; i++)
    {
    
      if (this.Admins[i].username == this.username)
      {
        this.counter = 1;
        this.auth.login(this.username, this.password)
        .pipe(first())
        .subscribe(
       
          result => this.router.navigate(['adminDashboard']),
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
