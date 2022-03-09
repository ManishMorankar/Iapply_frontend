import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../service/data.service';
import { PaymentService } from '../../../service/payment.service';
@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.scss']
})
export class PaymentResponseComponent implements OnInit {
  Success:boolean=false;
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private toastMsg: ToastrService, private data: DataService, private pService: PaymentService) { }
  status: String;
  trackingid: string;
  currentUser;
  iApplyUser;
  ngOnInit() {
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }
  this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
  
  this.route.queryParams
    .subscribe(params => {
      this.status = params.status;
      this.trackingid = params.trackingid;
    }
  );
  if(this.status == 'Success'){
    this.pService.changeMessage("Success");
    this.toastMsg.success('You have been subscribed successfully');
    localStorage.setItem('paymentInfo', '{ "paymentMethod": "Online", "paymentStatus": "Success", "subscriptionStatus": "Active", "status": null }');
    this.Success = true
    localStorage.setItem('Pay_Status', "Success")
    localStorage.setItem('Sub_Status', "Active")
    localStorage.setItem('Pay_Method', "Online")
  }
    if (this.status == 'Aborted') {
      this.router.navigate(['customer/selectPlan']);
      return;
    }
  this.getpaymentemail();
}
dashboard(){
  if(this.status == 'Success'){
    this.router.navigate(['customer/dashboard']);
  }
  else{
    this.router.navigate(['customer/selectPlan']);
  }
}
getpaymentemail() {
  this.apiService.get('CustomerProfile/PaymentEmail/' + this.currentUser.customerId)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
        }
      })
}
}
