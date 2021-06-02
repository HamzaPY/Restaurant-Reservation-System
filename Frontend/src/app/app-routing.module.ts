import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./shared/auth.guard";
import { RestGuard } from "./shared/rest.guard";

import { SignupComponent } from './components/signup/signup.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RestaurantCreateComponent } from './components/restaurant-create/restaurant-create.component';
import { RestaurantEditComponent } from './components/restaurant-edit/restaurant-edit.component';
import { HomeComponent } from './components/home/home.component';
import { SearchRestaurantComponent } from './components/search-restaurant/search-restaurant.component';
import { CustomerReservationComponent } from './components/customer-reservation/customer-reservation.component';
import { ManageRestaurantsComponent } from './components/manage-restaurants/manage-restaurants.component';
import { RestaurantDashboardComponent } from './components/restaurant-dashboard/restaurant-dashboard.component';
import { ManageMenuComponent } from './components/manage-menu/manage-menu.component';
import { ReservationViewComponent } from './components/reservation-view/reservation-view.component';
import { MenuEditComponent } from './components/menu-edit/menu-edit.component';
import { AllRestaurantsComponent } from './components/all-restaurants/all-restaurants.component';
import { RestaurantOverviewComponent } from './components/restaurant-overview/restaurant-overview.component';
import { RestaurantGalleryComponent } from './components/restaurant-gallery/restaurant-gallery.component';
import { AdminComponent } from './components/admin/admin.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard]},
  { path: 'adminDashboard', component: AdminDashboardComponent, canActivate: [AuthGuard]},
  { path: 'createRestaurant', component: RestaurantCreateComponent, canActivate: [AuthGuard]},
  { path: 'editRestaurant/:id', component: RestaurantEditComponent, canActivate: [AuthGuard]},
  { path: '', component: HomeComponent},
  { path: 'app', component: LandingPageComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'privacy', component: PrivacyPolicyComponent},
  { path: 'custProfile', component: CustomerProfileComponent},
  { path: 'verifyEmail/:id', component: VerifyEmailComponent},
  { path: 'allRestaurants', component: AllRestaurantsComponent},
  { path: 'searchRestaurant', component: SearchRestaurantComponent},
  { path: 'overviewRestaurant/:id', component: RestaurantOverviewComponent},
  { path: 'custReservation', component: CustomerReservationComponent},
  { path: 'manageRestaurant', component: ManageRestaurantsComponent, canActivate: [AuthGuard]},
  { path: 'restDashboard', component: RestaurantDashboardComponent, canActivate: [RestGuard]},
  { path: 'manageMenu', component: ManageMenuComponent, canActivate: [RestGuard]},
  { path: 'editItem/:id/:cateId/:name', component: MenuEditComponent, canActivate: [RestGuard]},
  { path: 'viewReservation', component: ReservationViewComponent, canActivate: [RestGuard]},
  { path: 'galleryRestaurant', component: RestaurantGalleryComponent, canActivate: [RestGuard]},
  { path: 'admin', component: AdminComponent},
  { path: 'restaurant', component: RestaurantComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }