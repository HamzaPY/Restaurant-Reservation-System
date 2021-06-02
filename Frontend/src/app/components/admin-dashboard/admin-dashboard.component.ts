import { Component, OnInit, NgZone } from '@angular/core';
import { AdminService } from './../../service/admin.service';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {

  }
  logout() {
    this.adminService.logout();
    this.router.navigateByUrl('/')
  }
}
