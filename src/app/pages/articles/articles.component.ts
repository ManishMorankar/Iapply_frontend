import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  BlogData;
  BlogDataId;
  recentArticlesSectionData: any;
  blogContent: any;

  SocialMediaContent;
  youtubelink: any;
  facebooklink: any;
  instagramlink: any;
  linkedinlink: any;

  NewsLetterForm: FormGroup;
  submitted1 = false;
  iApplyUser;
  whoWeAreSubSectionData: any;
  bannerData: any;
  FooterContentData;
  recentArticlesContentSectionData: any;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;
  temp: any;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder) { }
    Url: string = environment.Link;
  ngOnInit(): void {
    if (window.matchMedia('(max-width: 991px)').matches)
{
   $('.menu_wrpr ul li a').click(function(){
    $("#navbarNav").removeClass('show');

   });
}
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.getRecentArticlesContentSectionData();
    this.getSocialMediaContent();
    this.getWhoWeAreSubSectionData();
    this.getBannerData();
    this.getFooterContentData();

    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });
    this.loadScripts();

  }

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

  getRecentArticlesContentSectionData(){
    this.apiService.get('Blog/BlogContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.recentArticlesContentSectionData = res.result;
        this.temp = [...res.result];
      }
    }, err => {

    })
  }
  gotoBlogsPage(blogContentId) {
    this.router.navigate(['blogs']);
  }

  gotoBlogDetailPage(blogContentId) {
    this.router.navigate(['Articles', blogContentId]);
  }

  gotoPrivacyPolicyPage(){
    this.router.navigate(['privacy-policy']);
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

  goToLoginPage()
  {
    this.router.navigate(['login']);
  }
  goToSignUpPage() {
    this.router.navigate(['sign-up']);
  }

  gotoSubscribeSignupPage(){
    this.router.navigate(['subscribe/sign-up']);
  }

  gotoSiteMapPage()
  {
    this.router.navigate(['SiteMap']);
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
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('News Letter Data error');
        }
      });
    }
  }

  getWhoWeAreSubSectionData() {
    this.apiService.get('GetReadyToExploreWorldwideJobs/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.whoWeAreSubSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getFooterContentData(){
    this.apiService.get('FooterContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.FooterContentData = res.result[0];
      }
    }, err => {

    })
  }
  searchFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.blogTitle.toLowerCase().indexOf(val) !== -1 ||
        d.description.toLowerCase().indexOf(val) !== -1 ||
        d.shortDescription.toLowerCase().indexOf(val) !== -1 ||
        d.addedOn .toLowerCase().indexOf(val) !== -1 ||

        !val;
    });
    this.recentArticlesContentSectionData = temp;
}
loadScripts() {
  var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
  if (len == 0) {
    $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
  }
}
}
