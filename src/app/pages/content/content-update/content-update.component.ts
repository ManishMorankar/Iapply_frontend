import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContentHistoryPages } from '../../../Constant';
import { ApiService } from '../../../service/api.service';
import { ExcelService } from '../../../service/excel.service';
// import * as ContentHistoryPagesImport from '../../../Constant';

declare const window: any;
@Component({
  selector: 'app-content-update',
  templateUrl: './content-update.component.html',
  styleUrls: ['./content-update.component.scss']
})
export class ContentUpdateComponent implements OnInit {

  // PageName = ContentHistoryPagesImport.ContentHistoryPages;

  currentUser;
  selectedContentOption = 'content';
  aboutUsData;
  visionMissionData;
  subscriptionsData;

  aboutUsDesc = "";
  visionDesc = "";
  missionDesc = "";

  associationForm: FormGroup;
  AssocitionData;
  imageResult: SafeResourceUrl;
  noImg;
  companyImage;
  formData;
  association_id;
  selectedImage: SafeResourceUrl;
  filterFormAdmin: FormGroup;
  filterFormStandardPage: FormGroup;
  filterFormStandardContentUpdateHistory: FormGroup;

  @ViewChild('removeImageButton', {static: false}) removeImageButton: ElementRef;

  UploadVideoForm: FormGroup;
  VideoId;
  videosData:string;
  videoResult: SafeResourceUrl;
  video: any;
  submitted: boolean;
  currentUserDetailsId;
  currentUserType;
  currentCustomerId;
  iApplyUser;
  isSelected: boolean = false;

  contentUpdateRequestList;
  tempContentUpdateRequestList;
  tempContentUpdateRequestList1;

  tempContentUpdateRequestListStandard;
  selectedPageName = "";
  selectedPageName1 = "";
  pageNameArray = ContentHistoryPages
  UserDetails: any=[];
  tempPageNameArray =  ContentHistoryPages;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.filterFormAdmin = this.formBuilder.group({
      page: [''],
      user: [''],
      status: [''],
    });

    this.filterFormStandardPage = this.formBuilder.group({
      page: ['']
    });

    this.filterFormStandardContentUpdateHistory = this.formBuilder.group({
      page: ['']
    });

    this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
    this.currentUserDetailsId = this.iApplyUser.userDetailsId;
    this.currentUserType = this.iApplyUser.userType;
    this.currentCustomerId = this.iApplyUser.CustomerId;

    // this.getContentUpdateRequestList();
    this.getVideos();

    this.videoResult = this._sanitizer.bypassSecurityTrustResourceUrl(this.videosData);

    this.UploadVideoForm = this.formBuilder.group({
      VideoUrl:['', Validators.required],
     VideoTitle:['', Validators.required],
   Description:['', Validators.required],
    });

    if (localStorage.getItem("video")) {
      this.video = JSON.parse(localStorage.getItem("video"))
    }
    if (this.video){
      this.attachFormData();
    }

    this.getUserDetails();
    this.HideTideoChat();
  }
  HideTideoChat()
  {
    window.tidioChatApi.hide();
  }
  onContentOptionSelected(item) {
    this.selectedContentOption = item;
  }

  gotoRequestDetails(row){
    let flag = false;
    this.pageNameArray.forEach(element => {
      if (this.selectedPageName === element.url){
        this.router.navigate([element.route, row.id]);
        flag = true;
       }
    });
    if (!flag){
      this.toastMsg.error('Valid page not found to navigate');
    }
  }

  getUserDetails(){
    this.apiService.get('User_Details').subscribe(data=> {
      if (data.statusCode === '201' && data.result){
        this.UserDetails = data.result;
      }
    },
    error => {
      console.log(error);
    });
  }

  exportData() {
    this.excelService.exportAsExcelFile(this.contentUpdateRequestList, 'export-to-excel');
  }

  // searchFilter() {
  //   this.isSelected=true;
  //   this.getContentUpdateRequestList();
  //   if ((this.filterForm.controls.page.value != null && this.filterForm.controls.page.value != "") && (this.filterForm.controls.user.value != null && this.filterForm.controls.user.value != "") && (this.filterForm.controls.status.value == null || this.filterForm.controls.status.value == "" || this.filterForm.controls.status.value == "All")) {
  //     var filter_array = this.contentUpdateRequestList.filter(x => x.pageName == this.filterForm.controls.page.value);
  //     this.tempContentUpdateRequestList = filter_array;
  //     this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
  //   }
  // }

  onPageNameSelect(){
    if (this.selectedPageName){
      this.getContentUpdateRequestList();
    } else {
      this.contentUpdateRequestList = [];
      return;
    }
  }

  getContentUpdateRequestList(){
    this.contentUpdateRequestList = [];
    this.tempContentUpdateRequestList = [];
    this.apiService.get('ContentUpdate/'+this.selectedPageName).subscribe(res => {
      if (res.statusCode === '201' && res.result){
        this.contentUpdateRequestList = res.result
        this.tempContentUpdateRequestList1 = this.contentUpdateRequestList;
        this.applyFilter();
      }
    },
    // err => {
    //   this.contentUpdateRequestList = [];
    // }
    )
  }

  applyFilter(){

    if(this.currentUserType=='Admin'){
      var filter_pagenamearray = this.pageNameArray.filter(x => x.url == this.filterFormAdmin.controls.page.value);


    if ((this.filterFormAdmin.controls.page.value != null && this.filterFormAdmin.controls.page.value != "") && (this.filterFormAdmin.controls.user.value == null || this.filterFormAdmin.controls.user.value == "" || this.filterFormAdmin.controls.user.value == "All") && (this.filterFormAdmin.controls.status.value == null || this.filterFormAdmin.controls.status.value == "" || this.filterFormAdmin.controls.status.value == "All")) {
      var filter_array = this.tempContentUpdateRequestList1.filter(x => x.pageName == filter_pagenamearray[0].pagedbname);
      this.tempContentUpdateRequestList = filter_array;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
    }
    else if ((this.filterFormAdmin.controls.page.value != null && this.filterFormAdmin.controls.page.value != "") && (this.filterFormAdmin.controls.user.value != null && this.filterFormAdmin.controls.user.value != "") && (this.filterFormAdmin.controls.status.value == null || this.filterFormAdmin.controls.status.value == "" || this.filterFormAdmin.controls.status.value == "All")) {
      var filter_array = this.tempContentUpdateRequestList1.filter(x => x.pageName == filter_pagenamearray[0].pagedbname && x.addedBy == this.filterFormAdmin.controls.user.value);
      this.tempContentUpdateRequestList = filter_array;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
    }
    else if ((this.filterFormAdmin.controls.page.value != null && this.filterFormAdmin.controls.page.value != "") && (this.filterFormAdmin.controls.user.value == null || this.filterFormAdmin.controls.user.value == "" || this.filterFormAdmin.controls.user.value == "All") && (this.filterFormAdmin.controls.status.value != null && this.filterFormAdmin.controls.status.value != "")) {
      var filter_array = this.tempContentUpdateRequestList1.filter(x => x.pageName == filter_pagenamearray[0].pagedbname && x.status == this.filterFormAdmin.controls.status.value);
      this.tempContentUpdateRequestList = filter_array;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
    }
    else if ((this.filterFormAdmin.controls.page.value != null && this.filterFormAdmin.controls.page.value != "") && (this.filterFormAdmin.controls.user.value != null && this.filterFormAdmin.controls.user.value != "") && (this.filterFormAdmin.controls.status.value != null || this.filterFormAdmin.controls.status.value != "" || this.filterFormAdmin.controls.status.value == "All")) {
      var filter_array = this.tempContentUpdateRequestList1.filter(x => x.pageName == filter_pagenamearray[0].pagedbname && x.addedBy == this.filterFormAdmin.controls.user.value && x.status == this.filterFormAdmin.controls.status.value);
      this.tempContentUpdateRequestList = filter_array;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
    }

    else if ((this.filterFormAdmin.controls.page.value == null || this.filterFormAdmin.controls.page.value == "") && (this.filterFormAdmin.controls.user.value != null && this.filterFormAdmin.controls.user.value != "" && this.filterFormAdmin.controls.user.value == "All") && (this.filterFormAdmin.controls.status.value != null && this.filterFormAdmin.controls.status.value != "" && this.filterFormAdmin.controls.status.value == "All")) {
      var filter_array = this.tempContentUpdateRequestList1.filter(x => x.addedBy == this.filterFormAdmin.controls.user.value && x.status == this.filterFormAdmin.controls.status.value);
      this.tempContentUpdateRequestList = filter_array;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
    }
    else if ((this.filterFormAdmin.controls.page.value == null || this.filterFormAdmin.controls.page.value == "") && (this.filterFormAdmin.controls.user.value != null && this.filterFormAdmin.controls.user.value != "" && this.filterFormAdmin.controls.user.value != "All") && (this.filterFormAdmin.controls.status.value != null && this.filterFormAdmin.controls.status.value != "" && this.filterFormAdmin.controls.status.value != "All")) {
      var filter_array = this.tempContentUpdateRequestList1.filter(x => x.addedBy == this.filterFormAdmin.controls.user.value && x.status == this.filterFormAdmin.controls.status.value);
      this.tempContentUpdateRequestList = filter_array;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];

  }
    }
    if(this.currentUserType=='Standard'){
      var filter_pagenamearray = this.pageNameArray.filter(x => x.url == this.filterFormStandardContentUpdateHistory.controls.page.value);

      if ((this.filterFormStandardContentUpdateHistory.controls.page.value != null && this.filterFormStandardContentUpdateHistory.controls.page.value != "")) {
        var filter_array = this.tempContentUpdateRequestList1.filter(x => x.pageName == filter_pagenamearray[0].pagedbname);
        this.tempContentUpdateRequestListStandard = filter_array;
        this.tempContentUpdateRequestListStandard = [...this.tempContentUpdateRequestListStandard];
      }
    }
  }

  searchFilter(){
    if (this.selectedPageName == "undefined" || this.selectedPageName == "" || this.selectedPageName == null ){
      this.contentUpdateRequestList = [];
      this.toastMsg.error("Please select PageName")
      return;

    } else {
      this.getContentUpdateRequestList();
    }
  }
  clearFilter() {
    if(this.currentUserType=='Standard'){
      this.filterFormStandardPage.reset();
      this.tempContentUpdateRequestListStandard = this.tempContentUpdateRequestList1;
      this.tempContentUpdateRequestListStandard = [...this.tempContentUpdateRequestListStandard];
    }
    if(this.currentUserType=='Admin'){
      this.filterFormAdmin.reset();
      this.tempContentUpdateRequestList = this.tempContentUpdateRequestList1;
      this.tempContentUpdateRequestList = [...this.tempContentUpdateRequestList];
    }
  }

  searchFilter_StandardPages(){
    for(var i=0;i<this.pageNameArray.length;i++){
      if(this.selectedPageName1==this.pageNameArray[i].url){
        this.tempPageNameArray[i].name=this.pageNameArray[i].name;
        break
      }
    }
  }

  gotoPages(row){
    if (row.name == 'Home Section'){
      this.gotohome();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Who We Are Section'){
      this.gotoWhoWeAreSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Who We Are Sub-Section'){
      this.gotoWhoWeAreSubSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Who We Serve Section'){
      this.gotoWhoWeServeSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'How It Works Section'){
      this.gotoHowItWorksSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'How It Works Video Section'){
      this.gotoHowItWorksVideoSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Features Section'){
      this.gotoFeaturesSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Where We Go For Jobs (Counter) SubSection'){
      this.gotoWhereWeGoForJobsSubSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'What our client say about us (Testimonial) Section'){
      this.gotoWhatClientSaysAboutUsSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Video Section'){
      this.gotoVideosSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Choose Your Package Section'){
      this.gotoChooseYourPackageSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Recent Articles Section'){
      this.gotoRecentArticlesSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'FAQ Content Section'){
      this.gotoFAQContentSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'FAQ Question Answer Section'){
      this.gotoFAQQuestionAnswerSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Privacy Policy Section'){
      this.gotoPrivacyPolicySection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Terms And Conditions Section'){
      this.gotoTermsAndConditionsSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'We Are Social'){
      this.gotoWeAreSocialSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Lets Talk Section'){
      this.gotoLetsTalkSection();
      // this.router.navigate([row.route]);
    }
    if (row.name == 'Sitemap Section'){
      this.gotoSitemapSection();
      // this.router.navigate([row.route]);
    }

  }

  attachFormData(){
    this. UploadVideoForm.controls.VideoUrl.setValue(this.video.videoUrl);
    this. UploadVideoForm.controls.VideoTitle.setValue(this.video.title);
    this. UploadVideoForm.controls.Description.setValue(this.video.description);
  }

  getVideos(){
    this.apiService.get('Video').subscribe(data=> {
      if (data.statusCode === '201' && data.result){
        this.videosData = data.result;
      }
    },
    error => {
      console.log(error);
    });
  }
  getSanitizedVideoUrl(url){
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onSubmitVideo(){
    this.submitted = true;
    console.log(this.UploadVideoForm.value);
    if (this.UploadVideoForm.valid) {
      let payload= {
        VideoId:this.UploadVideoForm.value.videoId,
        VideoUrl: this.UploadVideoForm.value.VideoUrl,
        Title: this.UploadVideoForm.value.VideoTitle,
        Description: this.UploadVideoForm.value.Description,
      }
    if (this.UploadVideoForm.valid) {
      if (this.VideoId){
        payload['videoId'] = this.video.videoId;
        this.apiService.put('Video', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('Video  Details updated successfully');
            this.router.navigate(['app/content']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Video update error');
          }
        });
      } else{
        this.apiService.post('Video', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('video added successfully');
            this.UploadVideoForm.reset();
            this.router.navigate(['app/content']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Video add error');
          }
        });

      }

    }
    }


  }

  deleteVideos(event){
    this.apiService.post('Video/' +event, event)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.toastMsg.success('Video deleted successfully');
          this.getVideos();
        }
  });
  }

  get uf(){
    return this. UploadVideoForm.controls;
  }


  exportToExcel() {

  }


  gotoContactUsSection()
  {
    this.router.navigate(['app/Contact-Us-Section'])
  }
  gotohome(){
    this.router.navigate(['app/Home-update'])
  }

  gotoWhoWeAreSection() {
    this.router.navigate(['app/who-we-are-section'])
  }

  gotoWhoWeAreSubSection() {
    this.router.navigate(['app/who-we-are-sub-section'])
  }

  gotoWhoWeServeSection() {
    this.router.navigate(['app/who-we-serve-section'])
  }

  gotoHowItWorksSection(){
    this.router.navigate(['app/how-it-works-section'])
  }

  gotoHowItWorksVideoSection(){
    this.router.navigate(['app/how-it-works-video-section'])
  }

  gotoFeaturesSection()
  {
    this.router.navigate(['app/features-section'])
  }
  gotoPlatformInformation(){
    this.router.navigate(['app/platform-information-update'])
  }


  gotoSubscription(){
    this.router.navigate(['app/subscription-update'])
  }
  gotoTestimonial() {
    this.router.navigate(['app/testimonial']);
  }
  gotoPackage()
  {
    this.router.navigate(['app/package-update'])
  }

  // gotoWhereWeGoForJobsSection() {
  //   this.router.navigate(['app/where-we-go-for-job-section'])
  // }
  gotoWhereWeGoForJobsSubSection() {
    this.router.navigate(['app/where-we-go-for-job-subsection'])
  }
  gotoWhatClientSaysAboutUsSection() {
    this.router.navigate(['app/what-client-says-aboutus-section'])
  }
  gotoVideosSection() {
    this.router.navigate(['app/videos-section'])
  }
  gotoChooseYourPackageSection() {
    this.router.navigate(['app/choose-your-package-section'])
  }
  gotoRecentArticlesSection() {
    this.router.navigate(['app/recent-articles-section'])
  }
  gotoFAQContentSection() {
    this.router.navigate(['app/faq-content-section'])
  }
  gotoFAQQuestionAnswerSection() {
    this.router.navigate(['app/faq-question-answer-section'])
  }
  gotoPrivacyPolicySection(){
    this.router.navigate(['app/privacy-policy-section'])
  }
  gotoTermsAndConditionsSection(){
    this.router.navigate(['app/terms-and-conditions-section'])
  }
  gotoWeAreSocialSection(){
    this.router.navigate(['app/we-are-social-section'])
  }
  gotoLetsTalkSection(){
    this.router.navigate(['app/lets-talk-section'])
  }
  gotoCookiesSection(){
    this.router.navigate(['app/cookies-section'])
  }
  gotoSitemapSection(){
    this.router.navigate(['app/sitemap-section'])
  }

}
