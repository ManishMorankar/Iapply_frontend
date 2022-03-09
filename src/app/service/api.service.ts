import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs/index";
import { environment } from "../../environments/environment"
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router,) { }
  //iApply rest api base url
  baseUrl: string = environment.apiBaseUrl;

  /**
   * Handle all the POST requests
   * @param url
   * @param postBody
   */
  post(url: any, postBody: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, postBody)
  }

  /**
   * Handle all the PUT requests
   * @param url
   * @param postBody
   */
  put(url: any, postBody: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + url, postBody)
  }

  /**
   * Handle all the GET requests
   * @param url
   */
  // @Cacheable()
  get(url: any): Observable<any> {
    var response = this.http.get<any>(this.baseUrl + url);
    return response;
  }

  /**
   * Handle all the DELETE requests
   * @param url
   */
   delete(url: any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + url)
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), "TEST-M@%$#*!21@$&#%$*#61").toString();
    } catch (e) {
    }
  }

  checkPermission(feature: string) {
    let capabilities = localStorage.getItem('permissions')
    let decryptCaps = this.decryptData(capabilities)
    if (decryptCaps == feature) {
      return true
    } else {
      return false
    }
  }
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, "TEST-M@%$#*!21@$&#%$*#61");
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
    }
  }
  getToken() {
    return localStorage.getItem("token")
  }
  isTokenExpired = new BehaviorSubject(false);
  openLogin() {
    this.isTokenExpired.next(true);
  }
  closeLogin() {
    this.isTokenExpired.next(false);
  }
  logout() {
    localStorage.removeItem('iApplyUser');
    localStorage.removeItem('token');
    localStorage.removeItem("paymentInfo");
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
