import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  contactUsForm: FormGroup;
  submitted = false;
  whoWeAreSubSectionData;
  youtubelink: any;
  facebooklink: any;
  instagramlink: any;
  linkedinlink: any;
  SocialMediaContent;
  NewsLetterForm: FormGroup;
  iApplyUser;
  submitted1 = false;
  bannerData: any;
  FooterContentData;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;

  constructor(private formBuilder: FormBuilder, private router: Router,  private toastMsg: ToastrService,
    private apiService:ApiService, private activatedRoute:ActivatedRoute) { }
    Url: string = environment.Link;
  ngOnInit(): void {
    if (window.matchMedia('(max-width: 991px)').matches)
{
   $('.menu_wrpr ul li a').click(function(){
    $("#navbarNav").removeClass('show');

   });
}
    this.loadScripts();
    this.getWhoWeAreSubSectionData();
    this.getSocialMediaContent();
    this.getBannerData();
    this.getFooterContentData();

    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.contactUsForm = this.formBuilder.group({
      Name:['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      PhoneNumber:['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')]],
      Subject: ['', Validators.required],
      Message: ['', Validators.required]
    });

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

  get cuf(){
    return this.contactUsForm.controls;
  }

  get nlf(){
    return this.NewsLetterForm.controls;
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
  onSubmit(){
    this.submitted = true;
    if (this.contactUsForm.valid) {
      let payload= {
        Name: this.contactUsForm.value.Name,
        EmailId: this.contactUsForm.value.EmailId,
        PhoneNumber: this.contactUsForm.value.PhoneNumber,
        Subject: this.contactUsForm.value.Subject,
        Message: this.contactUsForm.value.Message
      }
      this.apiService.post('ContactUs', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your enquiry submitted successfully,We will get back to you in 24 Hrs.');
          this.contactUsForm.reset();
          this.submitted = false;
        }
      }, err => {
        console.log(err.error.status)
        this.toastMsg.error(err.error.message);
      });
    }
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
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }
  }


}
