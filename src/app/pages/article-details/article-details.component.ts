import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { environment } from '../../../environments/environment';
export class UploadAdapter {
  private loader;
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          var myReader = new FileReader();
          myReader.onloadend = e => {
            resolve({ default: myReader.result });
          };

          myReader.readAsDataURL(file);
        })
    );
  }
}
@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {

  BlogData;
  BlogId;
  blogContentID:any;
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
  UATLink:any;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private activatedRoute:ActivatedRoute, private formBuilder: FormBuilder) { }

  Url: string = environment.Link;

  ngOnInit(): void {

    if (window.matchMedia('(max-width: 991px)').matches)
{
   $('.menu_wrpr ul li a').click(function(){
    $("#navbarNav").removeClass('show');

   });
}
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.getWhoWeAreSubSectionData();
    this.getRecentArticlesContentSectionData();
    this.getBannerData();
    this.getFooterContentData();

    this.activatedRoute.params.subscribe( params =>
      this.BlogId = params['id']
    );
    if (this.BlogId){
      this.getRecentArticlesDataByID();
    } else {
      this.toastMsg.error('Unable to fetch blog details');
    }
    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });

    this.getSocialMediaContent();
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
  getRecentArticlesDataByID(){
    this.apiService.get('Blog/BlogContent/'+this.BlogId).subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.BlogData = res.result[0];
        this.temp = [...res.result];
       }
    }, err => {

    })
  }
  gotoBlogDetailPage(blogContentId) {
    this.router.navigate(['/visitor/blog-details',blogContentId]);
    // window.location.reload();
    this.apiService.get('Blog/BlogContent/'+blogContentId).subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.BlogData = res.result[0];
        this.temp = [...res.result];

       }
    }, err => {

    })
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
  gotoSignupPage() {
    this.router.navigate(['sign-up']);
  }

  gotoSubscribeSignupPage(){
    this.router.navigate(['subscribe/sign-up']);
  }

  gotoSiteMapPage()
  {
    this.router.navigate(['SiteMap']);
  }
  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
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
