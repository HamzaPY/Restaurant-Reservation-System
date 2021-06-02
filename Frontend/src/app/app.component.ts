import { Component } from '@angular/core';
import { AdminService } from "./service/admin.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gastro-Website';

  constructor(public authService: AdminService, private router: Router,) {

  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login']);
  }
}
