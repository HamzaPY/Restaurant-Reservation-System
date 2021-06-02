import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, 
UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RestaurantService } from "../service/restaurant.service";

@Injectable({
  providedIn: 'root'
})
export class RestGuard implements CanActivate {

  User:any = [];

  constructor(
    public authService: RestaurantService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      window.alert("Restaurant Access not allowed!");
      this.router.navigate(['home'])
    }
    return true;
  }
}