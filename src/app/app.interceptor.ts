import {Injectable} from '@angular/core';
//import {Observable} from 'rxjs/Observable';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { AppConfig } from './app.config';
import { ApiService } from './service/api.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AppInterceptor implements HttpInterceptor {
  config;
  CustomerId: any;
  iApplyUser: any;

  constructor(private apiService: ApiService,private toastMsg:ToastrService,
    appConfig: AppConfig
  ) {
    this.config = appConfig.getConfig();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req = req.clone({url: this.config.baseURLApi + req.url});
    req = req.clone({ url: req.url });
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {

      }
    }
    const token: string = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        // headers: req.headers.set('Authorization', 'Bearer ' + token)
        headers: req.headers.set('token', token)
      });
    }

    // next.handle(req);
    return next.handle(req).pipe(catchError(err => {

      console.log("Error Interceptor ", err)
      if (err.statusCode == 401 || err.status === 401) {
        // auto logout if 401 response returned from api
          this.apiService.logout();
      }
      //this.apiService.hideLoader = true;
      const error = err.error.message || err.statusText;
      this.AddErrorLog(err.url,err.message,err.message,err.status,err.statusText,this.CustomerId);
      return throwError(error);
    }))

  }

  AddErrorLog(Category ,Handledmessage,Systemmessage,status,statusText,AddedBy){
    let payload= {
      Category: Category,
      Handledmessage:Handledmessage,
      Systemmessage:  Systemmessage,
      status:status,
      statustext:statusText,
      EntryUser: this.iApplyUser.customerId
   }
      this.apiService.post('Customer/ErrorLog',payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){


        //  this.toastMsg.success('Error added Successfully');
        }
      }, error => {
        console.log(error)
        if (error){
         // this.toastMsg.error('Error cannot be added');
        }
      });
  }

}
