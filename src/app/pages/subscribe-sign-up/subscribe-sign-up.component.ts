import { Component, HostBinding, ElementRef, OnInit } from '@angular/core';
import { SignupService } from '../signup/signup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { PaymentService } from '../../service/payment.service';
import { environment } from '../../../environments/environment';

declare var $: any;

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
        // controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

@Component({
  selector: 'app-subscribe-sign-up',
  templateUrl: './subscribe-sign-up.component.html',
  styleUrls: ['./subscribe-sign-up.component.scss']
})
export class SubscribeSignUpComponent implements OnInit {
  myText;
  FooterContentData: any;
  SiteMapData: any;
  submitted1: boolean;
  NewsLetterForm: any;
  iApplyUser: any;
  linkedinlink: any;
  instagramlink: any;
  facebooklink: any;
  youtubelink: any;
  SocialMediaContent: any;
  whoWeAreSubSectionData: any;
  bannerData: any;
  registerForm: FormGroup;
  loginUser: any;
  VerfiyOTPForm: FormGroup;
  RegisterUser: any;
  EmailId: any;
  submitted: boolean;
  showOTP = false;
  ResendOTPForm: FormGroup;
  disableRegisterBtn: boolean;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;
  public account = {
    password: null
  };
  public barLabel: string = "Password strength:";

  constructor(private pService: PaymentService,public signupService: SignupService, private elementRef: ElementRef, private formBuilder: FormBuilder, private router: Router, private toastMsg: ToastrService, private apiService: ApiService, private activatedRoute: ActivatedRoute, private http: HttpClient,
    appConfig: AppConfig) { }
    Url: string = environment.Link;
  ngOnInit(): void {







      var input = document.querySelector("#phone");
      window['intlTelInput'](input, {
        // allowDropdown: false,
        // autoHideDialCode: false,
        // autoPlaceholder: "off",
        // dropdownContainer: document.body,
        // excludeCountries: ["us"],
        // formatOnDisplay: false,
        // geoIpLookup: function(callback) {
        //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
        //     var countryCode = (resp && resp.country) ? resp.country : "";
        //     callback(countryCode);
        //   });
        // },
        // hiddenInput: "full_number",
        initialCountry: "auto",
        // localizedCountries: { 'de': 'Deutschland' },
        // nationalMode: false,
        // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
        // placeholderNumberType: "MOBILE",
        // preferredCountries: ['cn', 'jp'],
        // separateDialCode: true,
        utilsScript: "assets/js/utils.js",
      });



    this.loadScripts();
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }

    this.registerForm = this.formBuilder.group({
      FirstName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      LastName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      MobileNumber: ['', [Validators.required, Validators.pattern("^[- +()0-9]{10,15}$")]],
      EmployementStatus: ['', Validators.required],
      Password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&].{8,30}')
      ]]
      ,
      ConfirmPassword: ['', Validators.required]
    },
    {
      validators: [Validation.match('Password', 'ConfirmPassword')]
    });

    this.VerfiyOTPForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      otp: ['', Validators.required, Validators.pattern('[0-9]{4}')],

    });
    this.ResendOTPForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
    });
    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });

    if (localStorage.getItem("currentUser")) {
      this.RegisterUser = JSON.parse(localStorage.getItem("RegisterUser"));
      this.EmailId = this.RegisterUser.EmailId;
    }
    if (localStorage.getItem("EmailId")) {
      this.EmailId = localStorage.getItem("EmailId")
    }
    if (this.RegisterUser) {
      this.attachFormData();
    }
    if (this.RegisterUser) {
      this.attachFormDataVF();
    }
    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();



  }


  attachFormData() {
    this.registerForm.controls.EmailId.setValue(this.RegisterUser.emailId);
    this.registerForm.controls.FirstName.setValue(this.RegisterUser.firstName);
    this.registerForm.controls.LastName.setValue(this.RegisterUser.lastName);
    this.registerForm.controls.MobileNumber.setValue(this.RegisterUser.MobileNumber);
    this.RegisterUser.controls.Password.setValue(this.RegisterUser.Password);
  }
  attachFormDataVF() {
    this.VerfiyOTPForm.controls.EmailId.setValue(this.RegisterUser.EmailId);
    this.VerfiyOTPForm.controls.otp.setValue(this.RegisterUser.Otp);

  }

  get rf() {
    return this.registerForm.controls;
  }
  get vf() {
    return this.VerfiyOTPForm.controls;
  }
  get nlf() {
    return this.VerfiyOTPForm.controls;
  }
  onVerify() {
    var OtpValue = [];
    var OTPMethodValue = "";
    $(".otp .form-control").each(function () {

      var OtpInputValue = $(this).val();
      OtpValue.push(OtpInputValue);
      OTPMethodValue = OtpValue.join('');

    });
    this.submitted = true;
    console.log(this.registerForm.value);

    if (OTPMethodValue) {
      console.log("valid input!!");
      let payload = {
        EmailId: this.registerForm.value.EmailId,
        otp: OTPMethodValue
      }
      this.apiService.post('CustomerAuntentication/VerifyOtp', payload).subscribe(data => {
        if (data.statusCode === '200' && data.result && data.result.user) {
          localStorage.clear();
          localStorage.setItem('token', data.result.token)
          localStorage.setItem('iApplyUser', JSON.stringify(data.result.user));
          localStorage.removeItem("emailId");
          this.parseCapabilityData(data.result.user.userType)
          this.getSubscriptionStatus(data.result.user.customerId, data.result.completedSteps);
          this.toastMsg.success('Your account has been created successfully.');
          this.router.navigate(['/customer/MyProfile']);

        }
      }, err => {
        console.log(err.error)
        if (err.error) {
          this.toastMsg.error('Invalid OTP');
        }
      });
    }

  }

  parseCapabilityData(userType: string) {
    let encrypt = this.apiService.encryptData(userType)
    localStorage.setItem("permissions", encrypt)
  }
  getSubscriptionStatus(CustomerId, CompletedSteps) {
    this.apiService.get('Login/SubscriptionStatus/' + CustomerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        localStorage.setItem('Sub_Status', data.result.subscriptionStatus)
        localStorage.setItem('Pay_Method', data.result.paymentMethod);
        localStorage.setItem('Pay_Status', data.result.paymentStatus);
        localStorage.setItem('paymentInfo', "null");

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
  }

  onRegister() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.toastMsg.error('Please Enter the Correct Password and Confirm Password');
      // return;
    }
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      let payload = {
        FirstName: this.registerForm.value.FirstName,
        LastName: this.registerForm.value.LastName,
        EmailId: this.registerForm.value.EmailId,
        MobileNumber: this.registerForm.value.MobileNumber,
        EmployementStatus: this.registerForm.value.EmployementStatus,
        Password: this.registerForm.value.Password,

      }
      if (!this.RegisterUser) {
        payload['EmailId'] = this.registerForm.value.EmailId;
        this.signupService.isFetching = true;
        this.apiService.post('CustomerAuntentication/Register', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result) {
            console.log(localStorage.getItem('data.result'));
            localStorage.setItem('EmailId', this.registerForm.value.EmailId)
            this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.');
            this.signupService.isFetching = false;
            this.showOTP = true;
            this.disableRegisterBtn = true;
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
            }, 100);

            $("#otp .form-control").keyup(function () {
              if (this.value.length == this.maxLength) {
                $(this).next('.form-control').focus();
              }
          });
            $('#SignupRegisterButton').hide();
            $(".resend_otp_btn").hide();
            setTimeout(function () {
              $(".resend_otp_btn").fadeIn();
              $(".countdown_timer").hide();

            }, 360000);
          }
        }, err => {
          console.log(err.error)
          if (err.error) {
            this.disableRegisterBtn = false;
            this.signupService.isFetching = false;
            this.toastMsg.error('Email adddress is already registered with us.');
          }
        });
      }

    }


  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      console.log("valid input!!");
      let payload = {
        EmailId: this.registerForm.value.EmailId,
      }
      this.apiService.post('CustomerAuntentication/ResendOtp', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.toastMsg.success('An OTP has been sent to your registered email ID. Please check your Inbox/Junk folders and enter the code below.');
        }
      }, err => {
        console.log(err.error)
        if (err.error) {
          this.toastMsg.error('Email id is already registered');
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
  isPasswordMatch() {
    if (this.registerForm.value.Password === this.registerForm.value.ConfirmPassword) {
      return true;
    } else {
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
  onSubmitNewsLetterForm() {
    this.submitted1 = true;
    console.log(this.NewsLetterForm.value);
    if (this.NewsLetterForm.valid) {

      let payload = {
        EmailId: this.NewsLetterForm.value.EmailId
      }

      this.apiService.post('NewsLetter', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.toastMsg.success('Email Registered successfully');
          this.NewsLetterForm.reset();
          this.submitted1 = false;
        }
      }, err => {
        console.log(err.error)
        if (err.error) {
          this.toastMsg.error('Failed to register your email address for news letter subscription.');
        }
      });
    }

  }

  goToLoginPage() {
    this.router.navigate(['login']);
  }
  goToSignUpPage() {
    this.router.navigate(['sign-up']);
  }
  gotoSubscribeSignupPage(){
    this.router.navigate(['subscribe/sign-up']);
  }
  gotoFaqPage() {
    this.router.navigate(['faqs']);
  }
  gotoContactUsPage() {
    this.router.navigate(['contact-us']);
  }
  gotoPrivacyPolicyPage() {
    this.router.navigate(['privacy-policy']);
  }

  gototTermsAndConditionsPage() {
    this.router.navigate(['terms-and-conditions']);
  }
  gotoSiteMapPage() {
    this.router.navigate(['SiteMap']);
  }
  getFooterContentData() {
    this.apiService.get('FooterContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.FooterContentData = res.result[0];
      }
    }, err => {

    })
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
  // native scripts
  loadScripts() {
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }
  }






}
