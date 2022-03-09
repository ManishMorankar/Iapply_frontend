import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  packageSectionData: any;
  packageContent: any;
  loginUser: any;
  RegisterUser: any;
  packageContentId: any;
  value: any;
  submitted: boolean;
  PackageContentId: any;
  currentUser: any;
  package: any;
  Package: any;
  packagePrice: any;
  personalProfileForm: FormGroup;
  personalProfile: any;
  formData;
  CustomerPlanId: any;
  packageName: any;
  PymentMethod = "Online";
  iApplyUser;
  SubscrptionPlan: any;
  url: string = '';
  urlSafe: SafeResourceUrl;
  //paymentInfo: any;
  paymentStatus: any;
  paymentMethod: any;
  subscriptionStatus: any;
  renInfo: any = [];

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private toastMsg: ToastrService, private router: Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder) { }

  redirectUrl: string = environment.paymentredirecturl;

  ngOnInit(): void {
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
    this.getPersonalProfile();
  }

  addCardDetails() {


    $('#payment').modal('hide')
    this.formData = new FormData();
    // this.formData.append('merchant_id', "45990");  -- Testing
    // this.formData.append('merchant_id', "48742");
    this.formData.append('order_id', this.CustomerPlanId);
    this.formData.append('amount', 1.0);
    this.formData.append('currency', "USD");
    this.formData.append('redirect_url', this.redirectUrl);
    this.formData.append('cancel_url', this.redirectUrl);
    this.formData.append('billing_name', this.personalProfile.firstName);
    if (this.personalProfile.address == "") {
      this.formData.append('billing_address', "NotAvailable");
    } else {
      this.formData.append('billing_address', this.personalProfile.address);

    }
    this.formData.append('billing_city', this.personalProfile.city);
    this.formData.append('billing_state', 'NotAvailable');
    this.formData.append('billing_zip', this.personalProfile.postalCode);
    this.formData.append('billing_country', 'India');
    this.formData.append('billing_tel', this.personalProfile.primaryPhoneNumber);
    this.formData.append('billing_email', this.personalProfile.primaryEmailId);
    this.formData.append('si_is_setup_amt', "N");
    this.formData.append('merchant_param1', "add-card-only");
    this.formData.append('merchant_param2', this.iApplyUser.customerId);
    this.formData.append('integration_type', "iframe_normal");
    if (localStorage.getItem("paymentInfo") == 'null') {
      localStorage.setItem('paymentInfo', '{ "paymentMethod": "Online", "paymentStatus": "Pending", "subscriptionStatus": "In-Active", "status": null }');
    }
    this.apiService.post('CustomerProfile/Payment', this.formData)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {

          this.url = data.result;
          this.urlSafe = this._sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
      }, err => {
        if (err.statusCode == 400)
          this.toastMsg.error('Failed , ' + err.error);
      })
  }

  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.iApplyUser.customerId)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.personalProfile = data.result
          if (this.personalProfile.firstName == "") {
            return;
          }
          if (this.personalProfile.address == null) {
            this.personalProfile.address = "";
          }
           this.addCardDetails();
        } else {
          this.toastMsg.error(data.result);
        }
      })
  }

}
