import { Component, ElementRef, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../app.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  showOTP = false;
  submitted = false;
  otpSubmitted = false;
  isiApplyEmployee = false;
  myText;

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
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;
  SocialMediaContent: any;
  whoWeAreSubSectionData: any;
  bannerData: any;
  constructor(public loginService: LoginService, private formBuilder: FormBuilder, private elementRef: ElementRef,private router: Router,  private toastMsg: ToastrService,private apiService:ApiService, private activatedRoute:ActivatedRoute, private http:HttpClient,
    appConfig: AppConfig) {}
    Url: string = environment.Link;
  ngOnInit() {

    var timer2 = "6:01";

    var interval = setInterval(function() {
    var timer = timer2.split(':');
      //by parsing integer, I avoid all extra string processing
      var minutes = parseInt(timer[0], 10);
      var seconds = parseInt(timer[1], 10);
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

    $(".resend_otp_btn").hide();
    setTimeout(function () {
      $(".resend_otp_btn").fadeIn();
      $(".countdown_timer").hide();

    }, 360000);

    // var callDuration = this.elementRef.nativeElement.querySelector('#time');
    // this.startTimer(callDuration);

      this.linkedInResponce = this.activatedRoute.snapshot.queryParams["code"];
      if (this.linkedInResponce){
        console.log(this.linkedInResponce)
        this.exchangeLinkedinAuthToken();
      }

      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
        otp:['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      });

      this.NewsLetterForm = this.formBuilder.group({
        EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
      });
    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();
    this.loadScripts();
    }

    linkedinLogin(){
      window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${
        this.linkedInCredentials.clientId
      }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;

    }

    googleLogin(){

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

      }
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
      return this.NewsLetterForm.controls;
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
      if (this.loginForm.value.email) {
        let payload= {
          EmailId: this.loginForm.value.email,
          otp: OTPMethodValue
        }
        this.apiService.post('CustomerAuntentication/PasswordResetUpdate', payload).subscribe(data => {
          if (data.statusCode === '201'){
            this.toastMsg.success('A system generated password has been sent to your registered email address.');
            this.router.navigate(['/login']);
          } else {
            this.toastMsg.error('Email address is not registered with us.');
          }
        }, err => {
          console.log(err.status)
          if (err.status == 400) {
            this.toastMsg.error('Invalid OTP.');
          }
        });
      }
    }
    onSubmit() {
      this.submitted = true;
      console.log(this.loginForm)
      if (this.loginForm.controls['email'].valid) {

        let payload= {
          EmailId: this.loginForm.value.email,
        }
        this.loginService.isFetching = true;
        this.apiService.post('CustomerAuntentication/PasswordReset', payload).subscribe(data => {
          console.log(data);
          this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.')
          this.loginService.isFetching = false;
          this.showOTP = true;
          $('#ForgotPasswordButton').hide();
        }, err => {
          console.log(err.error)
          if (err.error) {
            this.toastMsg.error('Your email address may not be registered with us.');
            this.loginService.isFetching = false;
          }
        });
      } else {
        this.toastMsg.error('Your email address is not registered with us.');
        this.loginService.isFetching = false;
        return false;
      }
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
      this.router.navigate(['/visitor/faq']);
    }
    gotoContactUsPage() {
      this.router.navigate(['/visitor/contact-us']);
    }
    gotoPrivacyPolicyPage(){
      this.router.navigate(['/visitor/privacy-policy']);
    }

    gototTermsAndConditionsPage() {
      this.router.navigate(['/visitor/terms-and-conditions']);
    }
    gotoSiteMapPage()
    {
      this.router.navigate(['/visitor/SiteMap']);
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
