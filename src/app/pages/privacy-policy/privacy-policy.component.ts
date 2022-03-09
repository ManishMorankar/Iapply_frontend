import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment'
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicyData;
  whoWeAreSubSectionData;
  youtubelink: any;
  facebooklink: any;
  instagramlink: any;
  linkedinlink: any;
  SocialMediaContent;
  submitted1 = false;
  NewsLetterForm: FormGroup;
  iApplyUser;
  bannerData: any;
  FooterContentData;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;

  constructor(private apiService:ApiService, private router:Router,private toastMsg:ToastrService, private formBuilder: FormBuilder) { }
  Url: string = environment.Link;
  ngOnInit(): void {
    if (window.matchMedia('(max-width: 991px)').matches)
{
   $('.menu_wrpr ul li a').click(function(){
    $("#navbarNav").removeClass('show');

   });
}
$('.cookies_cont').hide();
if (window.matchMedia('(max-width: 991px)').matches)
{
   $('.menu_wrpr ul li a').click(function(){
    $("#navbarNav").removeClass('show');

   });
}
var hasVisited = sessionStorage.getItem("hasVisited");

// If falsy, user didn't visited your page yet.
if (!hasVisited) {
    sessionStorage.setItem("hasVisited", 'true');
    $(".cookies_cont").delay(1000).fadeIn(); // Shows popup only once
}


  $('.cookies_btn').click(function() // You are clicking the close button
  {
      $('.cookies_cont').fadeOut(); // Now the pop up is hiden.
  });






    this.openCookiesConsent();
    this.loadScripts();
    this.getPrivacyPolicyData();
    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();

    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });
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
  get nlf(){
    return this.NewsLetterForm.controls;
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
  getPrivacyPolicyData() {
    this.apiService.get('PrivacyPolicy/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.privacyPolicyData = res.result[0];
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
  gotoSubscribeSignupPage(){
    this.router.navigate(['subscribe/sign-up']);
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
    $.getScript('assets/js/jquery.mapael.js')
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }
  }
  openCookiesConsent() {
    //document.cookie = "cookies-consent=yes;";
    let name = "cookies-consent=";
    let ca = document.cookie.split(';');
    var found = false;
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        found = true;
      }
    }
    if (!found) {


    }

    }
}
