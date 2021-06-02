import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JwtModule } from '@auth0/angular-jwt';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/authconfig.interceptor';
import { RestInterceptor } from './shared/restconfig.interceptor';
import { AdminService } from './service/admin.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SimpleSmoothScrollModule } from 'ng2-simple-smooth-scroll';
import { LightboxModule } from 'ngx-lightbox';
import { ReadMoreModule } from 'ng-readmore';
import { UiSwitchModule } from 'ngx-ui-switch';
import { BarRatingModule } from "ngx-bar-rating";
import { NgxUiLoaderModule, NgxUiLoaderConfig } from "ngx-ui-loader";
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SignupComponent } from './components/signup/signup.component';  
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RestaurantCreateComponent } from './components/restaurant-create/restaurant-create.component';
import { RestaurantEditComponent } from './components/restaurant-edit/restaurant-edit.component';
import { HomeComponent } from './components/home/home.component';
import { SearchRestaurantComponent } from './components/search-restaurant/search-restaurant.component';
import { CustomerReservationComponent } from './components/customer-reservation/customer-reservation.component';
import { ManageRestaurantsComponent } from './components/manage-restaurants/manage-restaurants.component';
import { RestaurantDashboardComponent } from './components/restaurant-dashboard/restaurant-dashboard.component';
import { RestaurantService } from './service/restaurant.service';
import { ManageMenuComponent } from './components/manage-menu/manage-menu.component';
import { ReservationViewComponent } from './components/reservation-view/reservation-view.component';
import { MenuEditComponent } from './components/menu-edit/menu-edit.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
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


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#FF4040',
  // bgsOpacity: 0.5,
  // bgsPosition: POSITION.bottomLeft,
  // bgsSize: 60,
  // bgsType: SPINNER.chasingDots,
  // blur: 5,
  // delay: 0,
  fastFadeOut: true,
  fgsColor: '#FF4040',
  // fgsPosition: POSITION.centerCenter,
  fgsSize: 90,
  // fgsType: SPINNER.chasingDots,
  // gap: 24,
  // logoPosition: POSITION.centerCenter,
  // logoSize: 120,
  // logoUrl: 'assets/angular.png',
  // overlayBorderRadius: '0',
  // overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: '#FF4040'
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 5,
  // hasProgressBar: false,
  // text: 'Welcome to ngx-ui-loader',
  // textColor: '#FFFFFF',
  // textPosition: POSITION.centerCenter,
  // maxTime: -1,
  // minTime: 500
};


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    AdminDashboardComponent,
    RestaurantCreateComponent,
    RestaurantEditComponent,
    HomeComponent,
    SearchRestaurantComponent,
    CustomerReservationComponent,
    ManageRestaurantsComponent,
    RestaurantDashboardComponent,
    ManageMenuComponent,
    ReservationViewComponent,
    MenuEditComponent,
    AllRestaurantsComponent,
    RestaurantOverviewComponent,
    RestaurantGalleryComponent,
    AdminComponent,
    RestaurantComponent,
    LandingPageComponent,
    VerifyEmailComponent,
    PrivacyPolicyComponent,
    CustomerProfileComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatCheckboxModule,
    NgSelectModule,
    FontAwesomeModule,
    NgxPaginationModule,
    NgxPageScrollCoreModule,
    NgxPageScrollModule,
    SimpleSmoothScrollModule,
    LightboxModule,
    ReadMoreModule,
    UiSwitchModule,
    BarRatingModule,
    LazyLoadImageModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCYCa1IwC9k6BZWtp95cp6AMhfLW64-0CA',
      libraries: ['places']
    }),
    BsDatepickerModule.forRoot(),
    
 
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['localhost:4000/users/login']
      }
    }),
    
    BrowserAnimationsModule,
    MatGoogleMapsAutocompleteModule,
  ],
  providers: [AdminService, {provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true}, 
    RestaurantService, {provide: HTTP_INTERCEPTORS, 
    useClass: RestInterceptor, 
    multi: true},
    GoogleMapsAPIWrapper ], 
  bootstrap: [AppComponent],
})
export class AppModule { }
