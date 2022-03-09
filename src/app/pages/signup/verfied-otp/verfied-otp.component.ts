import {Component, HostBinding,ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Rx';
import { ModalDirective } from 'ngx-bootstrap';
declare var $: any;
@Component({
  selector: 'app-verfied-otp',
  templateUrl: './verfied-otp.component.html',
  styleUrls: ['./verfied-otp.component.scss']
})
export class VerfiedOTPComponent {
  @ViewChild('staticModal') public staticModal: ModalDirective;
  VerfiyOTPForm: FormGroup;
  submitted = false;
  RegisterUser: any;
  CustomerId: any;
  loginUser: any;
  formData: any;
  ModifiedBy: any;
  ResendOTPForm: FormGroup;
EmailId:any;
  FooterContentData: any;
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
  constructor(private formBuilder: FormBuilder, private router: Router, private elementRef: ElementRef , private toastMsg: ToastrService,private apiService:ApiService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }
    if(localStorage.getItem("EmailId")) {
      this.EmailId = localStorage.getItem("EmailId")
    }
    this.VerfiyOTPForm = this.formBuilder.group({
      // EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      otp:['', [Validators.required, Validators.pattern('[0-9]{4}')]],

    });
    this.ResendOTPForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
});
         var callDuration = this.elementRef.nativeElement.querySelector('#time');
         this.startTimer(callDuration);
    if (localStorage.getItem("currentUser")) {
      this.RegisterUser = JSON.parse(localStorage.getItem("RegisterUser"))
    }

    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();
  }

  get vf(){
    return this.VerfiyOTPForm.controls;
  }
  get rf(){
    return this.ResendOTPForm.controls;
  }

  onVerify(){
    this.submitted = true;
    console.log(this.VerfiyOTPForm.value);
    if (this.VerfiyOTPForm.valid) {
      let payload= {
        EmailId: this.EmailId,
        otp: this.VerfiyOTPForm.value.otp
       }
        this.apiService.post('CustomerAuntentication/VerifyOtp', payload).subscribe(data => {
          if (data.statusCode === '200' && data.result && data.result.user){
            //  this.router.navigate(['/customer/Myprofile']);
            //  localStorage.setItem('token', data.result.token)
            //  localStorage.setItem('iApplyUser', JSON.stringify(data.result.user));
            //  localStorage.removeItem("emailId");
            //  this.toastMsg.success('OTP Verification Done Successfully');
            //  localStorage.removeItem("emailId");
            //  document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            localStorage.setItem('token', data.result.token)
            localStorage.setItem('iApplyUser', JSON.stringify(data.result.user));
            localStorage.removeItem("emailId");
            this.toastMsg.success('Verified OTP Successfully');
            this.router.navigate(['/customer/MyProfile']);

          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('OTP Verfication Failed registered');
          }
        });
      }

  }
  onSubmit(){

    this.submitted = true;
    console.log(this.ResendOTPForm.value);
    if (this.ResendOTPForm.valid) {
      let payload= {
        EmailId: this.ResendOTPForm.value.EmailId
       }
        this.apiService.post('CustomerAuntentication/ResendOtp', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('OTP Send Done Successfully, please Verify OTP Login ');
            this.router.navigate(['/register/VerfiedOTP']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Email id is already registered');
          }
        });
      }

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
        }
        if (element.socialMediaName === 'FaceBook'){
          this.facebooklink = element.socialMediaLink;
        }
        if (element.socialMediaName === 'Instagram'){
          this.instagramlink = element.socialMediaLink;
        }
        if (element.socialMediaName === 'LinkedIn'){
          this.linkedinlink = element.socialMediaLink;
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
      EmailId: this.NewsLetterForm.value.EmailId,
      AddedBy:  this.iApplyUser.userDetailsId
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



}

