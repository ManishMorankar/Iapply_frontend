import {Component, HostBinding, OnInit, ElementRef} from '@angular/core';
import {LoginService} from '.././login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../../app.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';;
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  showOTP = false;
  submitted = false;
  otpSubmitted = false;
  isiApplyEmployee = false;

  emailVal;
  passwordVal;
  checkboxVal = false;
  FooterContentData: any;
  submitted1: boolean;
  NewsLetterForm: any;
  iApplyUser: any;
  linkedinlink: any;
  facebooklink: any;
  instagramlink: any;
  youtubelink: any;
  SocialMediaContent: any;
  whoWeAreSubSectionData: any;
  bannerData: any;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;

  constructor(public loginService: LoginService, private formBuilder: FormBuilder, private elementRef: ElementRef, private router: Router,  private toastMsg: ToastrService,private apiService:ApiService, private activatedRoute:ActivatedRoute, private http:HttpClient,
    appConfig: AppConfig) {}
    Url: string = environment.Link;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', Validators.required],
      otp:['', [Validators.required, Validators.pattern('[0-9]{6}')]],
    });

    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();
    this.loadScripts();
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });
  }

  linkedinLogin(){

  }

  googleLogin(){

  }
  get nlf()
  {
    return this.NewsLetterForm.controls;
  }
  get lf(){
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
    if (this.loginForm.controls['email'].valid && this.loginForm.controls['password'].valid) {
      console.log("valid input!!");
      let payload= {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.loginService.isFetching = true;
      this.apiService.post('UserAuntentication/GenerateOtp', payload).subscribe(data => {
        console.log(data);
        this.toastMsg.success(' An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.')
        this.loginService.isFetching = false;
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
                  $("#LoginSubmitButton").hide();
                  $("#LoginSubmitButton").attr('disabled', true);
          $(".resend_otp_btn").hide();
          $(".resend_otp_btn").attr('disabled', true);
                  $(".resend_otp_btn").hide();
                  setTimeout(function () {
                    $(".resend_otp_btn").attr('disabled', false);
              $(".resend_otp_btn").fadeIn();
                      $(".countdown_timer").hide();

                      }, 360000);
      }
    ,
     err => {
      this.loginService.isFetching = false;
      this.toastMsg.error('Invalid email or password.')
      return false;
    });
  }
   else {
    this.loginService.isFetching = false;
    this.toastMsg.error('Invalid email or password.');
    return false;
  }
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


    console.log("login clicked!!");
    this.otpSubmitted = true;
    if (this.loginForm.value.email && this.loginForm.value.password) {
      let payload= {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        // otp: this.loginForm.value.otp
        otp: OTPMethodValue
      }
      this.apiService.post('Login', payload).subscribe(data => {
        if (data.statusCode === '200' && data.result && data.result.user){
          localStorage.setItem('token', data.result.token)
          localStorage.setItem('iApplyUser', JSON.stringify(data.result.user));
          this.parseCapabilityData(data.result.user.userType)
          this.toastMsg.success('Login successful');
          this.router.navigate(['app/contentUpdate']);
        }
      }, err => {
        console.log(err.error.status)
        if (err.error.status){
          // this.toastMsg.error('Invalid email or password');
          this.toastMsg.error('Invalid OTP');
        }
      });
    }
  }

  parseCapabilityData(userType: string) {
    let encrypt = this.apiService.encryptData(userType)
    localStorage.setItem("permissions", encrypt)
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
  loadScripts() {
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }
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
  startTimer(display) {
    var timer = 360;
    var minutes;
    var seconds;

    Observable.interval(1000).subscribe(x => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      --timer;
      if (timer < 0) {
        console.log('timer is ended');
      }
    })
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
        this.toastMsg.success(' An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.');
        // this.router.navigate(['/signup']);
      }
    }, err => {
      console.log(err.error)
      if (err.error) {
        this.toastMsg.error('Failed to send OTP to the email address.');
      }
    });


  }
}


