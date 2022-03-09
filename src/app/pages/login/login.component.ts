import { Component, HostBinding, OnInit, ElementRef } from '@angular/core';
import {LoginService} from './login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../app.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { PaymentService } from '../../service/payment.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { interval, timer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.template.html',
  styleUrls: [ './login.style.scss' ],
})
export class LoginComponent implements OnInit {
  // @HostBinding('class') classes = 'auth-page app';

  // email: string = '';
  // password: string = '';
  loginForm: FormGroup;
  showOTP = false;
  submitted = false;
  otpSubmitted = false;
  isiApplyEmployee = false;

  emailVal;
  passwordVal;
  checkboxVal = false;
  linkedInResponce

  linkedInCredentials = {
    clientId: "86ukbtxgewg1jd",
    clientSecret: "RoBccKALdhxqmtEy",
    redirectUrl: "http://localhost:4200/Login",
    scope: "r_liteprofile%20r_emailaddress%20w_member_social" // To read basic user profile data and email
  };
  FooterContentData: any;
  SiteMapData: any;
  NewsLetterForm: any;
  submitted1: boolean;
  iApplyUser: any;
  youtubelink: any;
  facebooklink: any;
  instagramlink: any;
  linkedinlink: any;
  SocialMediaContent: any;
  whoWeAreSubSectionData: any;
  bannerData: any;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;

  constructor(public loginService: LoginService, private pService: PaymentService, private elementRef: ElementRef, private formBuilder: FormBuilder, private router: Router, private toastMsg: ToastrService, private apiService: ApiService, private activatedRoute: ActivatedRoute, private http: HttpClient,
     appConfig: AppConfig) { }
     Url: string = environment.Link;
  ngOnInit() {
    this.loadScripts();
      this.linkedInResponce = this.activatedRoute.snapshot.queryParams["code"];
      if (this.linkedInResponce){
        console.log(this.linkedInResponce)
        this.exchangeLinkedinAuthToken();
      }

      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
        password: ['', Validators.required],
        otp:['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      });

      this.NewsLetterForm = this.formBuilder.group({
        EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
      });


    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();
    }

    linkedinLogin(){
      window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
        this.linkedInCredentials.clientId
      }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;

    }

    googleLogin(){

    }

    exchangeLinkedinAuthToken(){
      let payload = {
        grant_type: "authorization_code",  // value of this field should always be: 'authorization_code'
        code: this.linkedInResponce,
        redirect_uri: this.linkedInCredentials.redirectUrl,  // The same redirect_url used in step 2.1 (in login.component.ts)
        client_id: this.linkedInCredentials.clientId, // Follow step 1.2
        client_secret: this.linkedInCredentials.clientSecret   // Follow step 1.2
      }
      this.http.post('https://www.linkedin.com/oauth/v2/accessToken', payload).subscribe(data =>{
        console.log(data);
      }, err => {
        console.log(err);
      })
    }

    get lf(){
      return this.loginForm.controls;
    }
    get nlf(){
      return this.loginForm.controls;
    }

    setEmail(event: any) {
      this.emailVal = event.target.value;
    }
    setPassword(event: any) {
      this.passwordVal = event.target.value;
    }

    setCheckbox(event: any) {
      this.checkboxVal = event.target.checked;
    }

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
      // if (i == 4) {
      //   $("#fifth").val(pastedText.charAt(i));
      // }
      // if (i == 5) {
      //   $("#sixth").val(pastedText.charAt(i));
      // }
    }
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
      // if (i == 4) {
      //   $("#fifth").val(pastedText.charAt(i));
      // }
      // if (i == 5) {
      //   $("#sixth").val(pastedText.charAt(i));
      // }
    }
   }

    /**
     * Login post request
     */
    onSubmit() {
      this.submitted = true;
      console.log(this.loginForm)
      // if (this.loginForm.controls['email'].valid && this.loginForm.controls['password'].valid){
      //   this.toastMsg.success('OTP sent to your email id.')
      //   this.showOTP = true;
      // }
      if ((this.loginForm.controls['email'].valid && this.loginForm.controls['password'].valid) || (this.emailVal != "" && this.passwordVal != "")){
        console.log("valid input!!");
        let payload= {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
        }
        this.loginService.isFetching = true;
        this.apiService.post('CustomerAuntentication/GenerateOtp', payload).subscribe(data => {
          console.log(data);
          this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.')
          this.loginService.isFetching = false;
          this.showOTP = true;
          // var callDuration = this.elementRef.nativeElement.querySelector('#time');
          // this.startTimer(callDuration);


          var timer2 = "6:01";

          var interval = setInterval(function() {
          var timer = timer2.split(':');
            //by parsing integer, I avoid all extra string processing
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10.00);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            if (minutes < 0) clearInterval(interval);
            seconds = (seconds < 10) ? 0  + seconds : seconds;
            seconds = (seconds < 0) ? 59 : seconds;
            //minutes = (minutes < 10) ?  minutes : minutes;
            $('#time').html(minutes + ':' + seconds);
            timer2 = minutes + ':' + seconds;
          }, 1000);
          $("#otp .form-control").keyup(function () {

                        if (this.value.length == this.maxLength) {

                         $(this).next('.form-control').focus();

                       }

                    });
          $("#LoginSubmitButton").hide();
          $("#LoginSubmitButton").attr('disabled', true);
          $(".resend_otp_btn").hide();
          $(".resend_otp_btn").attr('disabled', true);
          setTimeout(function () {
            $(".resend_otp_btn").attr('disabled', false);
            $(".resend_otp_btn").fadeIn();
              $(".countdown_timer").hide();

              }, 360000);


        }, err => {
          this.loginService.isFetching = false;
          this.toastMsg.error('Invalid email or password.')
          return false;
        });
      } else {
        this.loginService.isFetching = false;
        this.toastMsg.error('Invalid email or password.');
        return false;
      }
    }

   onResendOtp() {
    this.submitted = true;
    // console.log(this.loginForm.value);
    console.log("valid input!!");
    let payload = {
   EmailId: this.loginForm.value.email,
    }
    this.apiService.post('CustomerAuntentication/ResendOtp', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result) {
        this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.');
        // this.router.navigate(['/signup']);
      }
    }, err => {
      console.log(err.error)
      if (err.error) {
        this.toastMsg.error('Failed to send OTP to the email address.');
      }
    });


   }


    onLogin(){
      // if (this.loginForm.value.otp !== '123456'){
      //   this.toastMsg.error('Invalid OTP');
      //   return
      // }

      var OtpValue = [];
      var OTPMethodValue = "";
      $(".otp .form-control").each(function () {

        var OtpInputValue = $(this).val();
        OtpValue.push(OtpInputValue);
       OTPMethodValue = OtpValue.join('');

      });
//alert(OTPMethodValue);

      console.log("login clicked!!");
      this.otpSubmitted = true;
      if (this.loginForm.value.email && this.loginForm.value.password) {
        let payload= {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
          otp: OTPMethodValue
        }
        this.apiService.post('Login', payload).subscribe(data => {
          if (data.statusCode === '200' && data.result && data.result.user) {
            localStorage.clear();
            localStorage.setItem('token', data.result.token)
            localStorage.setItem('iApplyUser', JSON.stringify(data.result.user));
            localStorage.setItem('paymentInfo', JSON.stringify(data.result.payment));
            localStorage.setItem('completed-steps', data.result.completedSteps);
            this.toastMsg.success('Login successful');
            this.parseCapabilityData(data.result.user.userType)
            this.getSubscriptionStatus(data.result.user.customerId, data.result.completedSteps)
          }
          else {
            this.toastMsg.error('Invalid email or password');
          }
        },err => {
          console.log(err.error.status)
          if (err.error.status){
            this.toastMsg.error('Invalid email or password');

          }
        });
      }
  }
  getSubscriptionStatus(CustomerId,CompletedSteps) {
    this.apiService.get('Login/SubscriptionStatus/' + CustomerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        localStorage.setItem('Sub_Status', data.result.subscriptionStatus)
        localStorage.setItem('Pay_Method', data.result.paymentMethod);
        localStorage.setItem('Pay_Status', data.result.paymentStatus);

        if (data.result.subscriptionStatus == "Active" || data.result.subscriptionStatus == "Past-Active") {
          this.router.navigate(['customer/dashboard']);
          this.pService.changeMessage(data.result.paymentStatus);
        }
        if (data.result.subscriptionStatus == "In-Active") {
          if (CompletedSteps < 10) {
            this.RedirectOnProfileStatus(CompletedSteps);
            return;
          }
          if (data.result.paymentMethod == "Offline" && data.result.paymentStatus == "Pending") {
            this.router.navigate(['customer/dashboard']);
          }
          else {
            this.router.navigate(['customer/selectPlan']);
          }
        }
      }
    })
  }

  parseCapabilityData(userType: string) {
    let encrypt = this.apiService.encryptData(userType)
    localStorage.setItem("permissions", encrypt)
  }

  RedirectOnProfileStatus(StepId) {
    if (StepId == 0) {
      this.router.navigate(['customer/MyProfile']);
    }
    if (StepId == 2) {
      this.router.navigate(['customer/personal-profile']);
    }
    if (StepId == 3) {
      this.router.navigate(['customer/experience']);
    }
    if (StepId == 4) {
      this.router.navigate(['customer/education']);
    }
    if (StepId == 5) {
      this.router.navigate(['customer/other-details']);
    }
    if (StepId == 6) {
      this.router.navigate(['customer/job-preference']);
    }
    if (StepId == 7) {
      this.router.navigate(['customer/other-attachments']);
    }
    if (StepId == 9) {
      this.router.navigate(['customer/consent']);
    }
    if (StepId == 10) {
      this.router.navigate(['customer/selectplan']);
    }
   /* this.apiService.get('CustomerProfile/ProfileStatus/' + CustomerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {

        if (data.result.result.customeProfile == 'Pending') {
          this.router.navigate(['customer/personal-profile']);
        }
        else if (data.result.result.customeExperience == 'Pending') {
          this.router.navigate(['customer/experience']);
        }
        else if (data.result.result.customerEducation == 'Pending') {
          this.router.navigate(['customer/education']);
        }
        else if (data.result.result.customerLanguage == 'Pending') {
          this.router.navigate(['customer/other-details']);
        }
        else if (data.result.result.customerJobTitle == 'Pending') {
          this.router.navigate(['customer/job-preference']);
        }
        else if (data.result.result.customerDocument == 'Pending') {
          this.router.navigate(['customer/other-attachments']);
        }

      }
    })*/
  }

    gotoForgotPasswordPage(){
      this.router.navigate(['forgot-password']);
    }
    getBannerData() {
      this.apiService.get('Home/HomeBanner').subscribe(res => {
        if (res.statusCode == "201" && res.result) {
          this.bannerData = res.result[0];
        }
      });
    }

    getWhoWeAreSubSectionData() {
      this.apiService.get('GetReadyToExploreWorldwideJobs/Approved').subscribe(res => {
        if (res.statusCode == "201" && res.result) {
          this.whoWeAreSubSectionData = res.result[0];
        }
      }, err => {

      })
    }
    getSocialMediaContent(){
      this.apiService.get('SocialMedia/Approved').subscribe(res => {
        if (res.statusCode == "201" && res.result) {
          this.SocialMediaContent = res.result;
          this.SocialMediaContent.forEach(element => {
            if (element.socialMediaName === 'YouTube'){
              this.youtubelink = element.socialMediaLink;
              this.youtubeIcon = element.downloadLink;
            }
            if (element.socialMediaName === 'FaceBook'){
              this.facebooklink = element.socialMediaLink;
              this.facebookIcon = element.downloadLink;
            }
            if (element.socialMediaName === 'Instagram'){
              this.instagramlink = element.socialMediaLink;
              this.instagramIcon = element.downloadLink;
            }
            if (element.socialMediaName === 'LinkedIn'){
              this.linkedinlink = element.socialMediaLink;
              this.linkedinIcon = element.downloadLink;
            }
          });
        }
      }, err => {

      })
    }
    onSubmitNewsLetterForm(){
      this.submitted1 = true;
      if (this.NewsLetterForm.valid){

        let payload = {
          EmailId: this.NewsLetterForm.value.EmailId
        }

        this.apiService.post('NewsLetter', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('Email Registered successfully');
            this.NewsLetterForm.reset();
            this.submitted1 = false;
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('News Letter Data error');
          }
        });
      }

    }
    getSiteMapData() {
      this.apiService.get('SiteMap/Approved').subscribe(res => {
        if (res.statusCode == "201" && res.result) {
          this.SiteMapData = res.result;
        }
      }, err => {

      });
    }
    goToLoginPage(){
      this.router.navigate(['login']);
    }
    goToSignUpPage(){
      this.router.navigate(['sign-up']);
    }
    gotoFaqPage() {
      this.router.navigate(['faqs']);
    }
    gotoContactUsPage() {
      this.router.navigate(['contact-us']);
    }
    gotoPrivacyPolicyPage(){
      this.router.navigate(['privacy-policy']);
    }

    gototTermsAndConditionsPage() {
      this.router.navigate(['terms-and-conditions']);
    }
    gotoSiteMapPage()
    {
      this.router.navigate(['SiteMap']);
    }
    getFooterContentData(){
      this.apiService.get('FooterContent/Approved').subscribe(res => {
        if (res.statusCode == "201" && res.result) {
          this.FooterContentData = res.result[0];
        }
      }, err => {

      })
    }

  loadScripts() {
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }
  }

  // startTimer(display) {
  //   var timer = 360;
  //   var minutes;
  //   var seconds;
  //   Observable?.interval(1000).subscribe(x => {
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

}
