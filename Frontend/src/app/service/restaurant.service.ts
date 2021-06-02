import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse,  HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {
  searchLoc: string;
  searchTime: string;
  searchDate: string;
  searchTables: string;
  reserveTime: string;
  reserveName: string;
  loginName: string;

  adminURL:string = 'admin';
  currentUser = {};
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) { }

  // Get Restaurants Function //

  getRestaurant() {
    let url = `${this.adminURL}/getRest`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  } 

  getToken() {
    return localStorage.getItem('rest_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('rest_token');
    return (authToken !== null) ? true : false;
  }

  // Get Users Function //

  getUsers() {
    let url = `${this.adminURL}/getUsers`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  } 


  // Restaurant Login //
  
  login(username: string, password: string):Observable<boolean>  {
    let url = `${this.adminURL}/loginRest`;
    return this.http.post<{token: string}>(url, {username: username, password: password})
     .pipe(
        map(result => {
          localStorage.setItem('rest_token', result.token);
          
          return true;
        })
      );
  }

  // Edit Reservation Function //

  editReservation(data): Observable<any> {
    let url = `${this.adminURL}/editReserve`;
    return this.http.put(url, data)
      .pipe(
        catchError(this.errorMgmt)
    )
  }

  // Edit Rating Function //

  editRating(data): Observable<any> {
    let url = `${this.adminURL}/editRating`;
    return this.http.put(url, data)
      .pipe(
        catchError(this.errorMgmt)
    )
  }

  
  // Edit Booking Function //

  editBooking(data): Observable<any> {
    let url = `${this.adminURL}/editBooking`;
    return this.http.put(url, data)
      .pipe(
        catchError(this.errorMgmt)
    )
  }

  // Add Customer Function //

  addCustomer(data): Observable<any> {
    let url = `${this.adminURL}/addCustomer`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Edit Customer Function //

  editCustomer(data, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileI', file);
    formData.append('cId', data.cId);
    formData.append('cUsername', data.cUsername);
    formData.append('cFirst', data.cFirst);
    formData.append('cLast', data.cLast);
    formData.append('cEmail', data.cEmail);

    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('PUT', this.adminURL+"/editCustomer", formData, options);
    return this.http.request(req);
  }

  // Add Rating Function //

  addRating(data): Observable<any> {
    let url = `${this.adminURL}/addRating`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get Rating Function //

  getRating() {
    let url = `${this.adminURL}/getRating`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  } 

  // Send Contact Function //

  sendContact(data): Observable<any> {
    let url = `${this.adminURL}/sendContact`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Notify Restaurant Function //

  notifyRestaurant(data): Observable<any> {
    let url = `${this.adminURL}/notifyRest`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Notify Customer Function //

  notifyCustomer(data): Observable<any> {
    let url = `${this.adminURL}/notifyCust`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Add Photos Gallery Function //

  addPhotos(files: Array<File>, nameRest): Observable<any> {
    const formData = new FormData();
    for(let i =0; i < files.length; i++){
      formData.append("uploads[]", files[i], files[i]['name']);
    }
    formData.append('rName', nameRest);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', this.adminURL+"/addPhotos", formData, options);
    return this.http.request(req);
  }

  // Get Customers Function //

  getCustomers() {
    let url = `${this.adminURL}/getCustomer`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  } 

  // Update Customer Status Function //

  updateStatus(id, status): Observable<any> {
    let url = `${this.adminURL}/editStatus/${id}/${status}`;
    return this.http.put(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Add Items Function //

  addItems(data, file3): Observable<any> {
    const formData = new FormData();
    formData.append('fileI', file3);
    formData.append('iRest', data.iRest);
    formData.append('iName', data.iName);
    formData.append('iPrice', data.iPrice);
    formData.append('iDesc', data.iDesc);
    formData.append('iCategory', data.iCategory);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', this.adminURL+"/addItems", formData, options);
    return this.http.request(req);
  }

  // Add Menu Function //

  addMenu(data, file): Observable<any> {
    const formData = new FormData();
    formData.append('fileC', file);
    formData.append('iRest', data.iRest);
    formData.append('cName', data.cName);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', this.adminURL+"/addMenu", formData, options);
    return this.http.request(req);
  }

  // Add Menu Category Function //

  addMenuCategory(data, file2): Observable<any> {
    const formData = new FormData();
    formData.append('fileC', file2);
    formData.append('iRest', data.iRest);
    formData.append('cName', data.cName);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('PUT', this.adminURL+"/addMenuCategory", formData, options);
    return this.http.request(req);
  }

  // Get Menu Function //

  getMenu() {
    let url = `${this.adminURL}/getMenu`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  } 

  // Get Specific Item Function //

  getItemById(itemId, cateId, iRest): Observable<any> {
    let url = `${this.adminURL}/getItem/${itemId}/${cateId}/${iRest}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update Menu Items Function //

  updateItem(itemId, cateId, iRest, data): Observable<any> {
    let url = `${this.adminURL}/updateItem/${itemId}/${cateId}/${iRest}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete Menu Items Function //

  deleteItem(itemId, cateId, iRest): Observable<any> {
    let url = `${this.adminURL}/deleteItem/${itemId}/${cateId}/${iRest}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  
  // Delete Menu Category Function //

  deleteCategory(cateId, iRest): Observable<any> {
    let url = `${this.adminURL}/deleteCategory/${cateId}/${iRest}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Logout Function //

  logout() {
    let removeToken = localStorage.removeItem('rest_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('rest_token') !== null);
  }

  // Error handling //
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error //
      errorMessage = error.error.message;
    } else {
      // Get server-side error //
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }



}