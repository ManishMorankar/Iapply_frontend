import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { initTimestamp } from 'ngx-bootstrap/chronos/units/timestamp';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';
declare var particlesJS: any;
declare var $: any;

@Component({
  selector: 'app-home',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  bannerData: any;
  whoWeAreSectionData: any;
  whoWeAreSectionDataInnerHTML: any;
  headerLogoImage: SafeResourceUrl;
  // homeBannerImage: SafeResourceUrl;
  whoWeServeSectionData;
  whoWeAreSubSectionData;
  howItWorksSectionData;
  howItWorksVideoSectionData;
  featuresSectionData;
  goForJobsSectionMapData;
  goForJobsSectionData;
  JobsAvailablityCounterContent;
  iconResult: SafeResourceUrl;
  JobsAvailablityCounterTitle;
  testimonialSectionData;
  testimonialContent;

  videoSectionData;
  packageSectionData;
  packageContent;
  recentArticlesSectionData;
  blogContent;
  SocialMediaContent;
  FooterContentData;

  ContactUsForm: FormGroup;
  NewsLetterForm: FormGroup;
  formData;
  iApplyUser;
  submitted = false;
  submitted1 = false;
  socialMediaIconResult: SafeResourceUrl;
  whoWeAreSubSectionImage: SafeResourceUrl;
  youtubelink: any;
  facebooklink: any;
  instagramlink: any;
  linkedinlink: any;
  testimonialContentSectionData: any;
  recentArticlesContentSectionData: any;
  youtubeIcon: any;
  facebookIcon: any;
  instagramIcon: any;
  linkedinIcon: any;
  testimonialContentSectionDataInPair: any;
  videoSectionDataInPair: any;
  BlogResult: any;
  recentContentSectionDataInPair: any[];


  constructor(private apiService: ApiService, private toastMsg: ToastrService, private router: Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder) {
  }
  Url: string = environment.Link;
  ngOnInit(): void {

     $('#video_modal').on('hidden.bs.modal', function() {
       var $this = $(this).find('iframe'),
         tempSrc = $this.attr('src');
       $this.attr('src', "");
       $this.attr('src', tempSrc);
     });




if (window.matchMedia('(max-width: 991px)').matches)
{
   $('.menu_wrpr ul li a').click(function(){
    $("#navbarNav").removeClass('show');

   });
}
// var hasVisited = sessionStorage.getItem("hasVisited");

// // If falsy, user didn't visited your page yet.
// if (!hasVisited) {
//     sessionStorage.setItem("hasVisited", 'true');
//     $(".cookies_cont").delay(1000).fadeIn(); // Shows popup only once
// }


//   $('.cookies_btn').click(function() // You are clicking the close button
//   {
//       $('.cookies_cont').fadeOut(); // Now the pop up is hiden.
//   });




    this.openCookiesConsent();
    this.loadScripts();
    //this.scrollToAnchor(100);
    this.getBannerData();
    this.getWhoWeAreData();
    this.getWhoWeAreSubSectionData();
    this.getWhoWeServeData();
    this.getHowItWorksSectionData();
    this.getHowItWorksVideoSectionData();
    this.getFeaturesSectionData();
    this.getGoForJobsSectionMapData();
    this.getGoForJobsSectionData();
    this.getJobsAvailablityCounterContent();
    this.getJobsAvailablityCounterTitle();
    this.getTestimonialSectionData();
    this.getTestimonialContentSectionData();
    this.getVideoSectiontData();
    this.getPackageSectionData();
    this.getRecentArticlesSectionData();
    this.getSocialMediaContent();
    this.getFooterContentData();
    this.getRecentArticlesContentSectionData();
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.ContactUsForm = this.formBuilder.group({
      Name:['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      PhoneNumber:['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')]],
      Subject: ['', Validators.required],
      Message: ['', Validators.required]
    });

    this.NewsLetterForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });
    particlesJS.load('particles-js', 'assets/js/particles-data.js', function () {
      console.log('particles.js loaded - callback');
    });

  }

  get cuf() {
    return this.ContactUsForm.controls;
  }

  get nlf(){
    return this.NewsLetterForm.controls;
  }

  onSubmitContactUsForm(){
  this.submitted = true;
    if (this.ContactUsForm.valid){

      let payload = {
        Name: this.ContactUsForm.value.Name,
        EmailId: this.ContactUsForm.value.EmailId,
        PhoneNumber: this.ContactUsForm.value.PhoneNumber,
        Subject: this.ContactUsForm.value.Subject,
        Message: this.ContactUsForm.value.Message,
        // AddedBy:  this.iApplyUser.userDetailsId
      }

      this.apiService.post('ContactUs', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your Enquiry is submitted Successfully, We will get back to you in 24 Hrs');
          this.ContactUsForm.reset();
          this.submitted = false;
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Contact Us Data error');
        }
      });
    }
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

  goToLoginPage(){
    this.router.navigate(['login']);
  }

  goToSignupPage(){
    this.router.navigate(['sign-up']);
  }

  gotoSubscribeSignupPage(){
    this.router.navigate(['subscribe/sign-up']);
  }

  // getHomeBannerImage() {
  //   if (this.homeBannerImage){
  //     return this.homeBannerImage;
  //   }
  // }
  getGoForJobsSectionMapData() {
        this.apiService.get('GoForJobs/GoForJobsCount').subscribe(res => {
          if (res.statusCode == "201" && res.result) {
            this.goForJobsSectionMapData = res.result.map;
           this.jqueryMapEvents(this.goForJobsSectionMapData);
         }
        }, err => {

        })
      }
  getBannerData() {
    this.apiService.get('Home/HomeBanner').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.bannerData = res.result[0];
        if(this.bannerData && this.bannerData.headerLogoResult){
          this.headerLogoImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.bannerData.headerLogoResult);
        }
        // this.homeBannerImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.bannerData.bannerImageResult);
      }
    }, err => {

    })
  }

  getWhoWeAreData(){
    this.apiService.get('WhoWeAre/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.whoWeAreSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getWhoWeServeData() {
    this.apiService.get('WhoWeServe/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.whoWeServeSectionData = res.result[0];
        if (this.whoWeServeSectionData && this.whoWeServeSectionData.imageResult && this.whoWeServeSectionData.imageResult.length > 0){
          this.whoWeAreSubSectionImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,'+this.whoWeServeSectionData.imageResult[0]);
        }
      }
    }, err => {

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
  getHowItWorksSectionData() {
    this.apiService.get('HowItWorks/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.howItWorksSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getHowItWorksVideoSectionData(){
    this.apiService.get('HowItWorksVideo/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.howItWorksVideoSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getFeaturesSectionData() {
    this.apiService.get('Features/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.featuresSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getGoForJobsSectionData() {
    this.apiService.get('GoForJobs/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.goForJobsSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getJobsAvailablityCounterContent() {
    this.apiService.get('JobsAvailablityCounter/JobsAvailablityCounterContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.JobsAvailablityCounterContent = res.result;
        // this.iconResult = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + res.result[0].iconResult);
      }
    }, err => {

    })
  }

  getJobsAvailablityCounterTitle() {
    this.apiService.get('JobsAvailablityCounter/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.JobsAvailablityCounterTitle = res.result[0];
      }
    }, err => {

    })
  }

  getTestimonialSectionData(){
    this.apiService.get('Testimonial/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.testimonialSectionData = res.result[0];
      }
    }, err => {

    })
  }
  getTestimonialContentSectionData(){
    this.apiService.get('Testimonial/TestimonialContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.testimonialContentSectionData = res.result;
        this.testimonialContentSectionDataInPair = [];
        for (var i = 0; i < this.testimonialContentSectionData.length; i=i + 1) {
          this.testimonialContentSectionDataInPair.push({ "SectionData1": this.testimonialContentSectionData[i]
          //, "SectionData2": this.testimonialContentSectionData[i + 1]
        })
        }
        this.jqueryEvents();
      }
    }, err => {

    })
  }

  getVideoSectiontData(){
    this.apiService.get('VideoMaster/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.videoSectionDataInPair= res.result;
        this.jqueryVideoEvents(this.videoSectionDataInPair);
      }
    }, err => {

    })
  }

  getSanitizedVideoUrl(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  getSanitizedImageUrl(url){
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  getPackageSectionData(){
    this.apiService.get('Package/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.packageSectionData = res.result[0];
        this.packageContent = this.packageSectionData.packageContent;
      }
    }, err => {

    })
  }

  getRecentArticlesSectionData(){
    this.apiService.get('Blog/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.recentArticlesSectionData = res.result[0];
      }
    }, err => {

    })
  }

  getRecentArticlesContentSectionData(){
    this.apiService.get('Blog/BlogContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.recentArticlesContentSectionData = res.result.slice(0,6);
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

  gotoBlogsPage() {
    this.router.navigate(['blogs']);
  }

  gotoBlogDetailPage(blogContentId) {
    this.router.navigate(['Articles',blogContentId]);
  }

  gotoSignupPage() {
    this.router.navigate(['sign-up']);
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

  getFooterContentData(){
    this.apiService.get('FooterContent/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.FooterContentData = res.result[0];
      }
    }, err => {

    })
  }

  // Native Javascript
  public scrollToAnchor(wait: number): void {
    var hashList = $(location).prop('hash').split('#');
    var hash = 'banner';
    if (hashList.length = 3) {
      hash = hashList[2];
    } else {
      return;
    }
    const element = $('#' + hash)
    if (element) {
      setTimeout(() => {
        element[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, wait)
    }

  }
  loadScripts() {
    $.getScript('assets/js/jquery.mapael.js')
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }
  }

  jqueryEvents() {
    try {
    setTimeout(function () {
        $('.testimonals_slider').slick({
          arrows: true,
          infinite: true,
          speed: 500,
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          dots: false,
          responsive: [{
            breakpoint: 1100,
            settings: {
              arrows: true,
              slidesToShow: 2,
              slidesToScroll: 2,
              autoplay: false,
            }
          },
          {
            breakpoint: 900,
            settings: {
              arrows: true,
              slidesToShow: 2,
              slidesToScroll: 1,
              autoplay: false,
            }
          },
          {
            breakpoint: 768,
            settings: {
              arrows: true,
              slidesToShow: 1,
              slidesToScroll: 1,
               autoplay: false,
            }
          }]
        });
      }, 200)
  } catch(e) {}
  }


  jqueryMapEvents(goForJobsSectionMapData){
    try {

              $(".mapcontainer").mapael({
                  map: {
                      name: "world_countries",
                      defaultArea: {
                         attrs: {
                          fill: "#b6c8ff",
                              stroke: "#fff",
                              "stroke-width": 0.5
                          },
                      attrsHover: {
                          fill: "#FFF",
                      },
                      }
                  },
                 areas:goForJobsSectionMapData
              });

              var all_hidden = 'show',
                  areas_hidden = 'show',
                  plots_hidden = 'show';

              $('#button-all').on('click', function () {
                  all_hidden = (all_hidden == 'show') ? 'hide' : 'show';

                  $(".mapcontainer").trigger('update', [{
                          setLegendElemsState: all_hidden,
                          animDuration: 1000
                      }]);
              });
              $('#button-areas').on('click', function () {
                  areas_hidden = (areas_hidden == 'show') ? 'hide' : 'show';

                  $(".mapcontainer").trigger('update', [{
                          setLegendElemsState: {"areaLegend": areas_hidden},
                          animDuration: 1000
                      }]);
              });
              $('#button-plots').on('click', function () {
                  plots_hidden = (plots_hidden == 'show') ? 'hide' : 'show';

                  $(".mapcontainer").trigger('update', [{
                          setLegendElemsState: {"plotLegend": plots_hidden},
                          animDuration: 1000
                      }]);
              },400);
       }
       catch (e) { }

  }
  jqueryVideoEvents(urls) {
    try {
      setTimeout(function () {
        $('.video_slider').slick({
          arrows: true,
          infinite: true,
          speed: 500,
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
          dots: false,
          responsive: [{
            breakpoint: 1100,
            settings: {
               arrows: true,
              slidesToShow: 2,
              slidesToScroll: 2,
              autoplay: false,
            }
          },
          {
            breakpoint: 900,
            settings: {
               arrows: true,
              slidesToShow: 2,
              slidesToScroll: 1,
               autoplay: false,
            }
          },
          {
            breakpoint: 768,
            settings: {
               arrows: true,
              slidesToShow: 1,
              slidesToScroll: 1,
               autoplay: false,
            }
          }]
        });


       for (let index = 0; index < urls.length; index = index+2) {
        for (let index = 0; index < urls.length; index = index+1) {
          var content1 = '<div class=" video-item h-100" >' +
           // '<div class="row" > ' +
            '<div class="w-100 arrowvidp" > ' +
            '<div class="embed-responsive embed-responsive-21by9 pt-5 mt-4" > ' +
            '<iframe width = "100%" height = "315" src = "' + urls[index].videoMasterUrl + '" title = "YouTube video player"' +
            'frameborder = "0"' +
            'allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
            'allowfullscreen > </iframe>' +
            '</div>' ;
           // '</div>';
          var content2 = '';
          if (index+1 < urls.length) {
            content2 = '<div class="col-lg-6 arrowvidp" >' +
              '<div class="embed-responsive embed-responsive-21by9 pt-5 mt-4" >' +
              '<iframe width="100%" height = "315" src = "' + urls[index + 1].videoMasterUrl + '" title = "YouTube video player"' +
              'frameborder = "0"' +
              'allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
              'allowfullscreen > </iframe>' +
              '</div>' +
              '</div>';
            }
              '</div>' +
              '</div>';

         // var content = content1 + content2;
         var content = content1 ;
          $('.video_slider').slick('slickAdd', content);
        }

      }
    } , 400);
  }
  catch (e) { }

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
$(document).ready(function(){
  $('.video_slider').on("click", function (event) {

    $(this).slick('slickPause');
  });
});
