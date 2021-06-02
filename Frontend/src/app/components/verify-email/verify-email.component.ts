import { Component, OnInit } from '@angular/core';
import { AdminService } from './../../service/admin.service';
import { RestaurantService } from './../../service/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  Users:any = [];
  NotVerified = false;
  constructor(private actRoute: ActivatedRoute, private adminService: AdminService, private restService: RestaurantService, private router: Router) { }

  ngOnInit(): void {
    this.readUsers();
  }
  
  readUsers(){
    let id = this.actRoute.snapshot.paramMap.get('id');
    this.adminService.getUsers().subscribe((data) => {
     this.Users = data;

      for (let i = 0; i < this.Users.length; i++)
      {
        if (this.Users[i].username == id) 
        {
          if (this.Users[i].emailVerify == false && this.Users[i].admin == false)
          {
            this.NotVerified = true;
            this.adminService.verifyUserEmail(this.Users[i]._id).subscribe((data) => {
              setTimeout(() => 
              {
                this.router.navigateByUrl('/');
              }, 
              3000);
            });
          }
          if (this.Users[i].emailVerify == true && this.Users[i].admin == false)
          {
            alert("E-Mail bereits verifiziert!")
            this.router.navigateByUrl('/');
          }
        }
      }
    });
  }
}
