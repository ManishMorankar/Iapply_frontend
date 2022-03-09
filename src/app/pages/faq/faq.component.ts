import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {


  faqsCardsData;
  SelectedFaqsCardsData;
  faqsQAData;
  NewsLetterForm: any;
  submitted1: boolean;
  iApplyUser: any;
  SocialMediaContent: any;
  youtubelink: any;
  facebooklink: any;
  instagramlink: any;
  linkedinlink: any;
  whoWeAreSubSectionData;
  whoWeServeSectionData: any;
  whoWeAreSubSectionImage: SafeResourceUrl;
  bannerData;
  FooterContentData;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder) { }
    Url: string = environment.Link;
  ngOnInit(): void {


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
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.getFaqsCards();
    this.getFaqsQA();
    this.getSocialMediaContent();
    this.getWhoWeAreSubSectionData();
    this.getBannerData();
    this.getFooterContentData();

    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });

  }

  // scrollToPosition(section){
  //   this.router.navigate(['./home'], { fragment: section });
  // }

  getBannerData() {
    this.apiService.get('Home/HomeBanner').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.bannerData = res.result[0];
      }
    });
  }

  get nlf(){
    return this.NewsLetterForm.controls;
  }

  getFaqsCards() {
    this.apiService.get('Faq/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.faqsCardsData = res.result;
      }
    }, err => {

    });
  }

  getFaqsQA() {
    this.apiService.get('Faq/FaqQuestionAnswer/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.faqsQAData = res.result;
      }
    }, err => {

    });
  }

  getSanitizedFaqsCardsImage(imageResult){
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,'+imageResult);
  }

  onFaqsCardsClick(item) {
    this.SelectedFaqsCardsData = item;
  }

  getWhoWeAreSubSectionData() {
    this.apiService.get('GetReadyToExploreWorldwideJobs/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.whoWeAreSubSectionData = res.result[0];
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
  gotoPrivacyPolicyPage(){
    this.router.navigate(['privacy-policy']);
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

  gototTermsAndConditionsPage() {
    this.router.navigate(['terms-and-conditions']);
  }

  gotoFaqPage() {
    this.router.navigate(['faqs']);
  }

  gotoContactUsPage() {
    this.router.navigate(['contact-us']);
  }

  gotoBlogsPage() {
    this.router.navigate(['blogs']);
  }
  gotoSubscribe()
  {
    this.router.navigate(['sign-up']);
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

  getSocialIconImage(socialMediaIconResult) {
    if (socialMediaIconResult){
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + socialMediaIconResult);
    }
  }

  getJobCounterContentIcon(iconResult){
    if (iconResult){
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,' + iconResult);
    }
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


