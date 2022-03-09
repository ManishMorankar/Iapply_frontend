import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
const jwt = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  config: any;
  _isFetching: boolean = false;
  _errorMessage: string = '';

  constructor(
    appConfig: AppConfig,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.config = appConfig.getConfig();
  }

  get isFetching() {
    return this._isFetching;
  }

  set isFetching(val: boolean) {
    this._isFetching = val;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(val: string) {
    this._errorMessage = val;
  }

  registerUser(payload) {
    // We check if app runs with backend mode
    if (!this.config.isBackend) {
      this.toastr.success('You\'ve been registered successfully');
      this.router.navigate(['/login']);
    } else {
      this.requestRegister();
      const creds = payload;
      if (creds.email.length > 0 && creds.password.length > 0) {
        this.http.post('/user/signup', creds).subscribe(() => {
          this.receiveRegister();
          this.toastr.success('You\'ve been registered successfully');
          this.router.navigate(['/login']);
        }, err => {
          this.registerError(err.response.data);
        });
      } else {
        this.registerError('Something was wrong. Try again');
      }
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    let data = null;

    // We check if app runs with backend mode
    if (!this.config.isBackend && token) return true;
    if (!token) return;
    const date = new Date().getTime() / 1000;
    try {
      data = jwt.decodeToken(token);
    } catch (e) {
      this.router.navigate(['/login']);
    }
    if (!data) return;
    return date < data.exp;
  }

  receiveToken(token) {
    let user: any = {};
    // We check if app runs with backend mode
    if (this.config.isBackend) {
      user = jwt.decodeToken(token).user;
      delete user.id;
    } else {
      user = {
        email: this.config.auth.email
      };
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.receiveRegister();
  }

  
  requestRegister() {
    this.isFetching = true;
  }

  receiveRegister() {
    this.isFetching = false;
    this.errorMessage = '';
  }

  registerError(payload) {
    this.isFetching = false;
    this.errorMessage = payload;
  }
  
}
