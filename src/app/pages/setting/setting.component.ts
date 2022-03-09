import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { initTimestamp } from 'ngx-bootstrap/chronos/units/timestamp';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { DataService } from '../../service/data.service';
declare var $: any;



    $( ".confirm_msg_wrpr" ).addClass('change_cnfrm');
/* Code added for matching password and confirm password */
export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control.value !== checkControl.value) {
        controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  myText;
  currentUser: any;
  updatePasswordForm: FormGroup;
  FeedbackForm: FormGroup;
  submitted: boolean;
  submitted1: boolean;
  showOTPModal: boolean = false;
  submitted2: boolean;
  SubscrptionPlan: any;
  customerId: string;
  // offlinePaymentReceiptForm: FormGroup;
  formData: FormData;
  offlinePaymentReceipt: string [] = [];
  offlinePaymentReceiptData: any;
  paymentInfo: any;
  paymentMethod: any;
  paymentStatus: any;
  status: any;
  subscriptionStatus: any;
  originalSubscriptionStatus;
  subscriptionStartDate;
  subscriptionEndDate;
  public account = {
    password: null
  };
  public barLabel: string = "Password strength:";
  iApplyUser: any;
  showOTP = false;
  showOTP1= false;
  otpSubmitted = false;
  notEligibleForPlanChange: boolean;
  CardData: any;
  icon:any;
icons = [{

    'Mastercard': "fab fa-cc-mastercard",
    'Amex': "fab fa-cc-amex",
    'Visa': "fab fa-cc-visa",
    'Credit-Card': "fab fa-credit-card",
    'Google-Wallet': "fab fa-google-wallet",
    'Paypal': "fab fa-paypal",

}]
  CardType: any;
  savedCreditCard: any;
  CustomerCardDetailsId: string;
  EmailId: any;
  showOTPModal1: boolean=false;
  // iconList = [ // array of icon class list based on type
  //   { type: "amex", icon: "fab fa-cc-amex" },
  //   { type: "diners-club", icon: "fab fa-cc-diners-club" },
  //   { type: "mastercard", icon: "fab fa-cc-mastercard" },
  //   { type: "discover", icon: "fab fa-cc-discover" },
  //   { type: "jcb", icon: "fab fa-cc-jcb" },
  //   { type: "paypal", icon: "fab fa-cc-paypal" },
  //   { type: "stripe", icon: "fab fa-cc-stripe" },
  //   { type: "visa", icon: "fab fa-cc-visa" },
  //   { type: "credit-card", icon: "fab fa-credit-card" },
  //   { type: "google-wallet", icon: "fab fa-google-wallet" },
  //   { type: "paypal", icon: "fab fa-paypal" },
  // ];



  constructor(private apiService: ApiService, private toastMsg: ToastrService, private router: Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private _location: Location, private elementRef: ElementRef, public loginService: LoginService, private data: DataService ) { }

  ngOnInit(): void {

      $( "#ChangePlan" ).click(function() {
      $( ".confirm_msg_wrpr" ).addClass('change_cnfrm');
      });

    this.data.changeMessage("in-active");
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }

    if (localStorage.getItem("iApplyUser") != 'null') {
      this.iApplyUser= JSON.parse(localStorage.getItem("iApplyUser"));
      this.customerId=this.iApplyUser.customerId;
      this.EmailId=this.iApplyUser.emailId;
    }

    // }
    if (localStorage.getItem("paymentInfo") != 'null') {
      this.paymentInfo= JSON.parse(localStorage.getItem("paymentInfo"));
      // this.paymentMethod=this.paymentInfo.paymentMethod;
      // this.paymentStatus=this.paymentInfo.paymentStatus;
      // this.status=this.paymentInfo.status;
      this.subscriptionStatus=this.paymentInfo.subscriptionStatus;
      this.originalSubscriptionStatus = this.paymentInfo.originalSubscriptionStatus;
      this.subscriptionStartDate = this.paymentInfo.subscriptionStartDate;
      this.subscriptionEndDate = this.paymentInfo.subscriptionEndDate;
    }
    if (localStorage.getItem("OriginalSubscriptionStatusCancel")) {
      this.originalSubscriptionStatus = 'Cancel';
    }
    this.updatePasswordForm = this.formBuilder.group({
      // EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      OldPassword: ['', Validators.required],
      Password: ['', [
        Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)
      ]]
      ,
      ConfirmPassword: ['', Validators.required],
      // Otp: ['', Validators.required, Validators.pattern('[0-9]{4}')],

    },
    {
      validators: [Validation.match('Password', 'ConfirmPassword')]
    });

    this.FeedbackForm = this.formBuilder.group({
      FeedbackTitle: ['', Validators.required],
      Description: [''],

    });

    // this.offlinePaymentReceiptForm = this.formBuilder.group({
    //   UploadDocument: ['']

    // });
    this.paymentMethod = localStorage.getItem("Pay_Method");
    this.paymentStatus = localStorage.getItem("Pay_Status");
    this.status = localStorage.getItem("Pay_Status");
    this.subscriptionStatus = localStorage.getItem("Sub_Status");

    this.CustomerCardDetailsId = localStorage.getItem("CustomerCardDetailsId");
    this.getDashboardDetails();
    this.getOfflinePaymentReceiptData();
    this.getUpgradeChanges();
    this.getCardDetails();
    this.savedCreditCard.forEach((x => {
      if (this.CardType === 'Mastercard') {
        this.icon = 'fab fa-cc-mastercard';
      }
      else if (this.CardType === 'Amex') {
        this.icon = 'fab fa-cc-amex';
      }
      else if (this.CardType === 'Visa') {
        this.icon = 'fab fa-cc-visa';
      }
    })
    );
  }

  getUpgradeChanges() {
    this.apiService.get('CustomerPlan/CheckPaymentStatus/' + this.customerId).subscribe(data => {
      if (data.statusCode === "201") {
        this.notEligibleForPlanChange = data.result;
      }
    })
  }

//OTP Configuration  for Paste

onPaste(event: ClipboardEvent) {
  let clipboardData = event.clipboardData;
  let pastedText = clipboardData.getData('text');
  for (var i = 0; i < pastedText.length; i++) {
    if (i == 0) {
      $("#first").val(pastedText.charAt(i));
    }
    if (i == 1) {
      $("#second").val(pastedText.charAt(i));
    }
    if (i == 2) {
      $("#third").val(pastedText.charAt(i));
    }
    if (i == 3) {
      $("#fourth").val(pastedText.charAt(i));
    }

  }
}
onPaste1(event: ClipboardEvent) {
  let clipboardData = event.clipboardData;
  let pastedText = clipboardData.getData('text');
  for (var i = 0; i < pastedText.length; i++) {
    if (i == 0) {
      $("#Five").val(pastedText.charAt(i));
    }
    if (i == 1) {
      $("#Six").val(pastedText.charAt(i));
    }
    if (i == 2) {
      $("#Seven").val(pastedText.charAt(i));
    }
    if (i == 3) {
      $("#Eight").val(pastedText.charAt(i));
    }

  }
}
changeSubscription(){

  $("#changeSubscriptionPop").modal('hide')

// var txt;
// var r = confirm("You Want To Continue!");
// if (r == true) {
//   txt = "You want to Change Subscription Then You Click on 'Ok' Button!";
   this.router.navigate(['customer/selectPlan']);
// } else {
//   txt = "You pressed Cancel!";
//   this.router.navigate(['customer/AccountSettings']);
// }
// document.getElementById("demo").innerHTML = txt;
}
onInput(pastedText: string) {
  for (var i = 0; i < pastedText.length; i++) {
    if (i == 0) {
      $("#first").val(pastedText.charAt(i));
    }
    if (i == 1) {
      $("#second").val(pastedText.charAt(i));
    }
    if (i == 2) {
      $("#third").val(pastedText.charAt(i));
    }
    if (i == 3) {
      $("#fourth").val(pastedText.charAt(i));
    }
  }
}

onInput1(pastedText: string) {
  for (var i = 0; i < pastedText.length; i++) {
    if (i == 0) {
      $("#Five").val(pastedText.charAt(i));
    }
    if (i == 1) {
      $("#Six").val(pastedText.charAt(i));
    }
    if (i == 2) {
      $("#Seven").val(pastedText.charAt(i));
    }
    if (i == 3) {
      $("#Eight").val(pastedText.charAt(i));
    }
  }
}

//OTP Configuration END


  getDashboardDetails() {
    this.apiService.get('CustomerProfile/DashboardDetails/' + this.iApplyUser.customerId)
    .subscribe(data => {if (data.statusCode === "201" && data.result) {
        this.SubscrptionPlan = data.result.subscrptionPlan;
      }
    })
  }
  // onBack(){
  //   this._location.back();
  // }

  get rf() {
    return this.updatePasswordForm.controls;
  }

  get ff() {
    return this.FeedbackForm.controls;
  }

  getFileName(docPath) {
    var result = docPath.split('\\');
    return result[result.length-1]
  }

  isPasswordMatch() {
    if (this.updatePasswordForm.value.Password === this.updatePasswordForm.value.ConfirmPassword) {
      return true;
    } else {
      return false;
    }
  }
//Card Details realted Data
getCardDetails() {
  this.apiService.get('CustomerProfile/CardDetails/' + this.iApplyUser.customerId)
  .subscribe(data => {if (data.statusCode === "201" && data.result) {
      this.CardData=data.result;
      for(var i=0 ;i<data.result.length;i++)
      {
        this.CustomerCardDetailsId=data.result[i].customerCardDetailsId;
      }

    }
  })
}

DeleteCardDetails() {
  this.apiService.delete('CustomerProfile/DeleteCardDetails/' +  this.CustomerCardDetailsId)
  .subscribe(data => {if (data.statusCode === "201" && data.result) {
    this.toastMsg.success('Card details has been deleted successfully');
    this.getCardDetails();
    }
  })
}
  sendOTP(){
    this.submitted = true;
    console.log("Step1 Execute!!");
    // console.log(this.updatePasswordForm.controls);
    if (this.updatePasswordForm.invalid) {
      this.toastMsg.error('Please fill all fields');
      // return;
    }

    if (this.updatePasswordForm.valid){
      let payload = {
        EmailId: this.iApplyUser.emailId,
        OldPassword: this.updatePasswordForm.controls.OldPassword.value,
        Password: this.updatePasswordForm.controls.Password.value,
      }
      this.apiService.post('CustomerAuntentication/SendOtpToUpdatePassword', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result == true) {
          this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.');
          this.showOTPModal = true;
          // var callDuration = this.elementRef.nativeElement.querySelector('#time');
          // this.startTimer(callDuration);
          this.showOTP = true;
          // var callDuration = this.elementRef.nativeElement.querySelector('#time');
          // this.startTimer(callDuration);
          var timer2 = "6:01";

          var interval = setInterval(function() {
          var timer = timer2.split(':');
            //by parsing integer, I avoid all extra string processing
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            if (minutes < 0) clearInterval(interval);
            seconds = (seconds < 0) ? 59 : seconds;
            seconds = (seconds < 10) ? 0  + seconds : seconds;
            //minutes = (minutes < 10) ?  minutes : minutes;
            $('#time').html(minutes + ':' + seconds);
            timer2 = minutes + ':' + seconds;
          }, 1000);
          $("#otp .form-control").keyup(function () {

                        if (this.value.length == this.maxLength) {

                         $(this).next('.form-control').focus();

                       }

                    });
          $(".LoginSubmitButton").hide();
          $("#LoginSubmitButton").attr('disabled', true);
          $(".resend_otp_btn").hide();
          $(".resend_otp_btn").attr('disabled', true);
          setTimeout(function () {
            $(".resend_otp_btn").attr('disabled', false);
              $(".countdown_timer").hide();

              }, 360000);


        }

        else if (data.statusCode === '201' && data.result == false) {
          this.showOTPModal = false;
          this.toastMsg.error('Please enter correct current password');
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('OTP sent error');
        }
      });
    }
  }

  // startTimer(display) {
  //   var timer = 360;
  //   var minutes;
  //   var seconds;

  //   Observable.interval(1000).subscribe(x => {
  //     minutes = Math.floor(timer / 60);
  //     seconds = Math.floor(timer % 60);

  //     minutes = minutes < 10 ? "0" + minutes : minutes;
  //     seconds = seconds < 10 ? "0" + seconds : seconds;

  //     display.textContent = minutes + ":" + seconds;

  //     --timer;
  //     if (timer < 0) {
  //       console.log('timer is ended');
  //     }
  //   })
  // }

  updatePassword(){
    var OtpValue = [];
    var OTPMethodValue = "";
    $(".otp .form-control").each(function () {

      var OtpInputValue = $(this).val();
      OtpValue.push(OtpInputValue);
     OTPMethodValue = OtpValue.join('');

    });
    console.log("Step2 Execute!!");
    console.log("Update Password clicked!!");
    this.submitted1 = true;
    this.otpSubmitted = true;
   if (this.updatePasswordForm.valid){
      let payload = {
        EmailId: this.iApplyUser.emailId,
        OldPassword: this.updatePasswordForm.controls.OldPassword.value,
        Password: this.updatePasswordForm.controls.Password.value,
        Otp: OTPMethodValue
      }
      this.apiService.post('CustomerAuntentication/UpdatePassword', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          console.log("Password updated successfully!!");
          this.toastMsg.success('Password Updated Successfully');
          this.updatePasswordForm.reset();
          this.submitted1 = false;
          this.showOTP= false;
        }
        else {
          this.toastMsg.error('Please enter correct Current Password');
        }
      },err => {
       // this.signupService.isFetching = false;
        // this.disableRegisterBtn = false;
        this.toastMsg.error('Password Updation Error')
        return false;
      });
    } else {
      //this.signupService.isFetching = false;
      this.toastMsg.error('Password Updation Error')
      return false;
    }
    }





  cancelSubscription(){

    $("#YesCancle").hide();
    $("#NoCancle").hide();
    // console.log(this.FeedbackForm.controls);
    this.submitted2 = true;
    if (this.FeedbackForm.invalid){
      this.toastMsg.error('Please select atleast one option');
    }

    $("#confirmationcanclesubcribtion").hide();
    if (this.FeedbackForm.valid){
      let payload = {
        FeedbackTitle: this.FeedbackForm.controls.FeedbackTitle.value,
        Description: this.FeedbackForm.controls.Description.value,
        AddedBy: this.customerId
      }
      this.apiService.post('AccountSetting/Feedback', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Subsription Cancelled');
          this.FeedbackForm.reset();
          this.submitted2 = false;
          this.originalSubscriptionStatus = 'Cancel';
          localStorage.setItem('OriginalSubscriptionStatusCancel', 'Cancel');
        }
        // else {
        //   this.toastMsg.error('Subsription cancelled error');
        // }
      },err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Subsription cancelled error');

        }
      });
    }
  }

ChangeSubscriptionOTP()
  {
  // console.log(this.loginForm.value);
  console.log("Step3 Execute!!");
    console.log("valid input!!");
    let payload = {
   EmailId: this.EmailId,
    }
    this.apiService.post('CustomerAuntentication/ResendOtp', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result) {
        this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.');
        // this.router.navigate(['/signup']);


        this.showOTPModal1 = true;
        // var callDuration = this.elementRef.nativeElement.querySelector('#time');
        // this.startTimer(callDuration);
        this.showOTP1 = true;
        // var callDuration = this.elementRef.nativeElement.querySelector('#time');
        // this.startTimer(callDuration);
        var timer3 = "6:01";
        var interval = setInterval(function() {
          var timer = timer3.split(':');
            //by parsing integer, I avoid all extra string processing
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            if (minutes < 0) clearInterval(interval);
            seconds = (seconds < 0) ? 59 : seconds;
            seconds = (seconds < 10) ? 0  + seconds : seconds;
            //minutes = (minutes < 10) ?  minutes : minutes;
            $('#time3').html(minutes + ':' + seconds);
            timer3 = minutes + ':' + seconds;
          }, 1000);
          $("#otp1 .form-control").keyup(function () {

                        if (this.value.length == this.maxLength) {

                         $(this).next('.form-control').focus();

                       }

                    });
                    $("#ChangePlan").hide();
                    $("#ChangePlan").attr('disabled', true);
                    console.log("Yes Button is Hide");

                    console.log("No Button is Hide");
                    $("#ChangeNoPlan").hide();
                   $("#ChangeNoPlan").attr('disabled', true);
                    $("#ResendOtp").hide();
                    $("#ResendOtp").attr('disabled', true);
                    setTimeout(function () {
                        $(".countdown_timer").hide();
                        $("#ResendOtp").attr('disabled', false);
                        }, 360000);


                  }

                  else if (data.statusCode === '201' && data.result == false) {
                    this.showOTPModal1 = false;
                    this.toastMsg.error('Please enter correct current password');
                  }
                }, err => {
                  console.log(err.error)
                  if (err.error){
                    this.toastMsg.error('OTP sent error');
                  }
                });
              }


ChangeSubscriptionLastOTP(){
                var OtpValue = [];
                var OTPMethodValue = "";
                $(".otp .form-control").each(function () {

                  var OtpInputValue = $(this).val();
                  OtpValue.push(OtpInputValue);
                 OTPMethodValue = OtpValue.join('');

                });
                console.log("Change Subscription Button clicked!!");
                this.submitted1 = true;
                this.otpSubmitted = true;
                if (OTPMethodValue) {
                  console.log("valid input!!");
                  let payload = {
                    EmailId: this.EmailId,
                    otp: OTPMethodValue
                  }
                  this.apiService.post('CustomerAuntentication/VerifyAccountSettingOtp', payload).subscribe(data => {
                    if (data.statusCode === '201' && data.result) {

                      this.router.navigate(['customer/selectPlan']);
                    }
                  }, err => {
                    console.log(err.error)
                    if (err.error) {
                      this.toastMsg.error('Invalid OTP');
                    }
                  });
                }


                }

  selectFile(event) {
    if(event.target.files.length===0){
      return;
    }
    for(var i=0;i<event.target.files.length;i++){
      this.offlinePaymentReceipt.push(event.target.files[i]);
    }
    console.log(this.iApplyUser.customerId);
    console.log(this.offlinePaymentReceipt);
    // this.uploadAndProgress();
    this.formData = new FormData();

        this.formData.append('AddedBy', this.iApplyUser.customerId);
        for(let i=0;i<this.offlinePaymentReceipt.length;i++)
        {
          this.formData.append('UploadDocument', this.offlinePaymentReceipt[i]);
        }
        this.apiService.post('AccountSetting/Receipt', this.formData)
        .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.toastMsg.success('File uploaded successfully');
          this.getOfflinePaymentReceiptData();
        }
      },err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('File upload error');

        }
        });
  }

  // /*uploadAndProgress() {
  //   this.submitted = true;
  //   console.log(this.offlinePaymentReceiptForm.value);
  //   this.formData = new FormData();

  //       this.formData.append('AddedBy', this.currentUser.customerId);
  //       for(let i=0;i<this.offlinePaymentReceipt.length;i++)
  //       {
  //         this.formData.append('UploadDocument', this.offlinePaymentReceipt[i]);
  //       }
  //       this.apiService.post('AccountSetting/Receipt', this.formData)
  //       .subscribe(data => {
  //       if (data.statusCode === "201" && data.result) {
  //         this.toastMsg.success('Files uploaded successfully');
  //       }
  //     });
  // }*/
  // getFileExtension(data) { // this will give you icon class name
  //   let ext = data.split(".").pop();
  //   let obj = this.iconList.filter(row => {
  //     if (row.type === ext) {
  //       return true;
  //     }
  //   });
  //   if (obj.length > 0) {
  //     let icon = obj[0].icon;
  //     return icon;
  //   } else {
  //     return "";
  //   }
  // }
  getOfflinePaymentReceiptData(){
    this.apiService.get('AccountSetting/Receipt/'+this.customerId).subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.offlinePaymentReceiptData = res.result;
      }
    }
    // ,err => {
    //   console.log(err.error)
    //   if (err.error){
    //     this.toastMsg.error('File Upload Get Data error');

    //   }
    // }
    );
  }

}
