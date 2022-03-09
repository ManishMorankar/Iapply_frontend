import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-selectplan',
  templateUrl: './selectplan.component.html',
  styleUrls: ['./selectplan.component.scss']
})
export class SelectplanComponent implements OnInit {
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
    this.package = JSON.parse(localStorage.getItem('Package'));
    this.packageContent = JSON.parse(localStorage.getItem('PackageContent'));
    this.getDashboardDetails();
    this.getPackageSectionData();
    this.getPersonalProfile();
    this.activatedRoute.queryParams
      .subscribe(params => {
        //this.renInfo = params['renInfo']
        this.renInfo = params.PackageRenew;
        this.packageContentId = params.PackageContentId;
        this.packagePrice = params.PackagePrice;
      }
      );
    console.log(this.renInfo)
    if (this.renInfo == 'PackageRenew') {

      this.subscribe();
      $('.payment_wrpr').removeClass('hide');
      $('.package_cont').addClass('hide');
    }
    this.personalProfileForm = this.formBuilder.group({
      FirstName: [''],
      Address: [''],
      PostalCode: [''],
      PrimaryPhoneNumber: [''],
      PrimaryEmailId: ['']
    });
  }
  getDashboardDetails() {
    this.apiService.get('CustomerProfile/DashboardDetails/' + this.iApplyUser.customerId)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.SubscrptionPlan = data.result.subscrptionPlan;
        }
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
          this.personalProfileForm.controls.FirstName.setValue(this.personalProfile.firstName);
          this.personalProfileForm.controls.Address.setValue(this.personalProfile.address);
          this.personalProfileForm.controls.PostalCode.setValue(this.personalProfile.postalCode);
          this.personalProfileForm.controls.PrimaryPhoneNumber.setValue(this.personalProfile.primaryPhoneNumber);
          this.personalProfileForm.controls.PrimaryEmailId.setValue(this.personalProfile.primaryEmailId);

        } else {
          this.toastMsg.error(data.result);
        }
      })
  }
  getPackageSectionData() {
    this.apiService.get('Package/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.packageSectionData = res.result[0];
        this.packageContent = this.packageSectionData.packageContent;
        console.log(localStorage.getItem('data.result'));
        localStorage.setItem('Package', JSON.stringify(res.result));
        localStorage.setItem('PackageContent', this.packageContent);
        localStorage.setItem('PackageContent', JSON.stringify(this.packageContent));

      }
    }, err => {

    })
  }

  onStart(event) {
    this.packageContentId = event.packageContentId;
    this.packagePrice = event.packagePrice;
    this.packageName = event.packageName;
    this.submitted = true;
    /*if (localStorage.getItem("paymentInfo") != 'null') {
      this.paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
      if (this.paymentInfo.paymentStatus != "Success") {
        localStorage.setItem('paymentInfo', '{ "paymentMethod": "Online", "paymentStatus": "Pending", "subscriptionStatus": "In-Active", "status": null }');
      }
    }*/
    this.paymentMethod = localStorage.getItem("Pay_Method");
    this.paymentStatus = localStorage.getItem("Pay_Status");
    this.subscriptionStatus = localStorage.getItem("Sub_Status");
    if (this.paymentStatus != "Success") {
      localStorage.setItem('Sub_Status', "In-Active")
      localStorage.setItem('Pay_Method', "Online");
      localStorage.setItem('Pay_Status', "Pending");
    }

    this.subscribe();
    $('.payment_wrpr').removeClass('hide');
    $('.package_cont').addClass('hide');
  }

  online() {
    this.PymentMethod = "Online"
  }
  offline() {
    this.PymentMethod = "Offline"
  }
  subscribe() {

    var result = this.packagePrice.split('$');
    var price = result[result.length - 1];
    var currency = result[result.length - 2];
    if (this.PymentMethod == "Offline") {
      /*if (localStorage.getItem("paymentInfo") != 'null') {
        if (this.paymentInfo.paymentStatus != "Success") {
          localStorage.setItem('paymentInfo', '{ "paymentMethod": "' + this.PymentMethod + '", "paymentStatus": "Pending", "subscriptionStatus": "In-Active", "status": null }');
        }
      } else {
        localStorage.setItem('paymentInfo', '{ "paymentMethod": "' + this.PymentMethod + '", "paymentStatus": "Pending", "subscriptionStatus": "In-Active", "status": null }');
      }*/
      localStorage.setItem('Sub_Status', "In-Active")
      localStorage.setItem('Pay_Method', this.PymentMethod);
      localStorage.setItem('Pay_Status', "Pending");
    }
    let payload = {
      packageContentId: this.packageContentId,
      AddedBy: this.currentUser.customerId,
      PaymentMethod: this.PymentMethod,
    }
    this.apiService.post('CustomerPlan', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result) {
        this.CustomerPlanId = data.result.customerPlanId;
        if (this.PymentMethod == "Offline") {
          /*if (localStorage.getItem("paymentInfo") != 'null') {
            this.paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
            if (this.paymentInfo.subscriptionStatus == "Active") {
              localStorage.setItem('paymentInfo', '{ "paymentMethod": "Offline", "paymentStatus": "Pending", "subscriptionStatus": "Active", "status": null }');
            } else {
              localStorage.setItem('paymentInfo', '{ "paymentMethod": "Offline", "paymentStatus": "Pending", "subscriptionStatus": "In-Active", "status": null }');
            }
          } else {
            localStorage.setItem('paymentInfo', '{ "paymentMethod": "Offline", "paymentStatus": "Pending", "subscriptionStatus": "In-Active", "status": null }');
          }*/

          if (this.subscriptionStatus == "Active") {
            localStorage.setItem('Sub_Status', "Active")
            localStorage.setItem('Pay_Method', "Offline");
            localStorage.setItem('Pay_Status', "Pending");
          } else {
            localStorage.setItem('Sub_Status', "In-Active")
            localStorage.setItem('Pay_Method', "Offline");
            localStorage.setItem('Pay_Status', "Pending");
          }

          localStorage.setItem('step', "10");
          localStorage.setItem('current-step', "10");
          localStorage.setItem('completed-steps', "10");
          $('#payment').modal('hide')
          this.router.navigate(['/customer/offline-payment-response']);
        }
        else {
          // get all the fields from the screen
          this.formData = new FormData();
          // this.formData.append('merchant_id', "45990");  -- Testing
          // this.formData.append('merchant_id', "48742");
          this.formData.append('order_id', this.CustomerPlanId);
          this.formData.append('amount', price);
          this.formData.append('currency', "USD");
          this.formData.append('redirect_url', this.redirectUrl);
          this.formData.append('cancel_url', this.redirectUrl);
          this.formData.append('billing_name', this.personalProfile.firstName);
          this.formData.append('si_is_setup_amt', "Y");
          if (this.personalProfile.address == "") {
            this.formData.append('billing_address', "NotAvailable");
          } else {
            this.formData.append('billing_address', this.personalProfile.address);

          }
          this.formData.append('billing_city', this.personalProfile.city);
          this.formData.append('billing_state', 'NotAvailable');
          this.formData.append('billing_zip', this.personalProfile.postalCode);
          this.formData.append('billing_country', this.personalProfile.countryName);
          this.formData.append('billing_tel', this.personalProfile.primaryPhoneNumber);
          this.formData.append('billing_email', this.personalProfile.primaryEmailId);
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

        localStorage.setItem('current-step', "11");
        localStorage.setItem('completed-steps', "10");

        $('#payment').modal('hide')

      }
    }, err => {
      console.log(err.error)
      if (err.error) {
        this.toastMsg.error('Plan Process Failed');
      }
    });

  }
  goToLoginPage() {
    this.router.navigate(['login']);
  }

  goToSignUpPage() {
    this.router.navigate(['sign-up']);
  }
}
