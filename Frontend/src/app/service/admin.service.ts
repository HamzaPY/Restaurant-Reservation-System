import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse,  HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

export interface searchData {
  searchLoc: string,
  searchTime: string,
  searchDate: string,
  searchTables: string
}

export interface userData {
  _id : string,
  firstname : string,
  lastname : string,
  role : number,
  hod : boolean,
  admin : boolean
}

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  searchLoc: string;
  searchTime: string;
  searchDate: string;
  searchTables: string;
  reserveTime: string;
  reserveName: string;

  adminURL:string = 'admin';
  currentUser = {};
  
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) { }

  // Add Restaurant Function //
  
  addRestaurant(data, file: File, file2: File, oDays: Array<string>, oStart: Array<string>, oEnd: Array<string>): Observable<any> {
    const formData = new FormData();
    formData.append('fileI', file);
    formData.append('fileT', file2);
    formData.append('rName', data.rName);
    formData.append('rOver', data.rOver);
    formData.append('rLoc', data.rLoc);
    formData.append('rCont', data.rCont);
    formData.append('rWeb', data.rWeb);
    formData.append('rFace', data.rFace);
    formData.append('rInst', data.rInst);
    formData.append('rYt', data.rYt);
    formData.append('rDel', data.rDel);
    formData.append('rCate', data.rCate);
    formData.append('rPrice', data.rPrice);
    formData.append('rEmail', data.rEmail);
    formData.append('rPass', data.rPass);
    formData.append('street', data.street);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('zipCode', data.zipCode);
    formData.append('rBook', data.rBook);

    for(var i = 0; i < oDays.length; i++)
    {
      formData.append("rDays",oDays[i]);
    }
    for(var i = 0; i < oStart.length; i++)
    {
      formData.append("rStart",oStart[i]);
    }
    for(var i = 0; i < oEnd.length; i++)
    {
      formData.append("rEnd",oEnd[i]);
    }
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const req = new HttpRequest('POST', this.adminURL+"/addRest", formData, options);
    return this.http.request(req);
  }

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

  // Get Specific Restaurant Function //

  getRest(id): Observable<any> {
    let url = `${this.adminURL}/getSpecRest/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update Restaurants Function //

  updateRestaurant(id, data): Observable<any> {
    let url = `${this.adminURL}/updateRest/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete Restaurants Function //

  deleteRestaurant(id, name): Observable<any> {
    let url = `${this.adminURL}/deleteRest/${id}/${name}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Add Restaurant Location Function //

  addLocation(id, data): Observable<any> {
    let url = `${this.adminURL}/setLoc/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
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


  // Admin Login //
  
  login(username: string, password: string):Observable<boolean>  {
    let url = `${this.adminURL}/login`;
    return this.http.post<{token: string}>(url, {username: username, password: password})
     .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          
          return true;
        })
      );
    
  }

  // Customer Login //
  
  loginCust(username: string, password: string):Observable<boolean>  {
    let url = `${this.adminURL}/login`;
    return this.http.post<{token: string}>(url, {username: username, password: password})
     .pipe(
        map(result => {
          //localStorage.setItem('access_token', result.token);
          
          return true;
        })
      );
    
  }

  // Customer Verify Email //
  
  verifyUserEmail(id): Observable<any> {
    let url = `${this.adminURL}/verifyUserEmail/${id}`;
    return this.http.put(url, id)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Logout Function //

  logout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['home']);
    }
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  // Admin Registration //

  Register(data): Observable<any> {
    let url = `${this.adminURL}/signup`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Customer Registration //

  RegisterCust(data, file: File): Observable<any> {
      const formData = new FormData();
      formData.append('fileI', file);
      formData.append('firstname', data.firstname);
      formData.append('lastname', data.lastname);
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('email', data.email);

      const header = new HttpHeaders();
      const params = new HttpParams();
  
      const options = {
        params,
        reportProgress: true,
        headers: header
      };
      const req = new HttpRequest('POST', this.adminURL+"/signupCust", formData, options);
      return this.http.request(req);
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