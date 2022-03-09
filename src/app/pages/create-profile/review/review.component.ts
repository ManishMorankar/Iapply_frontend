import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  selectedImage:SafeResourceUrl;
  noImg;
  profileImage;
  CustomerProfileId: 0;
  currentUser: any;
  personalProfile: any;
  getProfileInformationData: any;
  getExperienceData: any;
  getCertificatesData: any;
  getAchievementsData: any;
  getSummaryData: any;
  getSocialProfileData: any;
  getEducationData: any;
  getProjectDetailsData: any;
  getPatentsData: any;
  getLanguageData: any;
  getAdditionalInformationData: any;
  getPortfolioData: any;
  getPreferredJobData: any;
  getPreferredSkillsData: any;
  getJobCateoryData: any;
  // getJobIndustryData: any;
  getJobCountryData: any;
  getExpectedSalaryData: any;
  getOtherAttachmentsData: any;
  getResumeAttachmentData: any;
  iApplyUser;
  personalProfileForm: FormGroup;
  step: any;
  documentType: any;
  completedStep: any = 0;
  SubscriptionCancel: boolean = false;
  PaymentInfo;
  ReviewActionLabel: string = 'Continue';
  areYouAuthorizedCountry;
  iconList = [ // array of icon class list based on type
    { type: "xlsx", icon: "fa fa-file-excel" },
    { type: "pdf", icon: "fa fa-file-pdf" },
    { type: "jpg", icon: "fa fa-file-image" },
    { type: "docx", icon: "fa fa-file-word-o" },
    { type: "png", icon: "fa fa-file-image" },
    { type: "csv", icon: "fa fa-file-csv" },
    { type: "txt", icon: "fa fa-file-text" },
    { type: "json", icon: "fa fa-file-text" },
  ];

  hasChange: boolean = false;
  form: any;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg:ToastrService, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }
    if (localStorage.getItem("paymentInfo") != 'null') {
      this.PaymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
      if (this.PaymentInfo.subscriptionStatus == "Cancel") {
        this.SubscriptionCancel = true;
      }
    }

    if (localStorage.getItem("Sub_Status") == 'Active' || localStorage.getItem("Sub_Status") == 'Past-Active') {
      this.ReviewActionLabel = "Save Changes"
    }

    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];

    });
    if (this.CustomerProfileId == 0 || this.CustomerProfileId == undefined) {
      this.getPersonalProfile();
    } else {
      this.getAllData();
      this.getResumeData();
      this.getOtherAttachmentData();
    }
  }

  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
        .subscribe(data => {
          if (data.statusCode === '201' && data.result) {
            this.personalProfile = data.result;
            this.CustomerProfileId =  this.personalProfile.customerProfileId;
            this.getAllData();
            this.getResumeData();
            this.getOtherAttachmentData();
          }
        })
  }
  getResumeData(){
    this.apiService.get('CustomerProfile/Attachment/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data) {
        this.getResumeAttachmentData = data.result;

      }
    })
  }

  getOtherAttachmentData(){
    this.apiService.get('CustomerProfile/Attachment/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data) {
        this.getOtherAttachmentsData = data.result;

      }
    })
  }
  setStatus() {
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.personalProfileForm.controls.BirthDate.value >= today) {
      this.personalProfileForm.controls.BirthDate.reset();
      this.toastMsg.error("Birth date must be less than today date");
    }

  }

  onFileChange(event) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size < 250000) {
      this.selectedImage = <File> event.target.files[0];
      console.log(this.selectedImage);
    } else {
      this.toastMsg.error("Image size should be under 250kb")
    }
  }

  getProfileImage() {
    if (this.getProfileInformationData.length > 0) {
      if (this.getProfileInformationData[0].imageResult == null)
      {
        this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
        return this.noImg;
      }
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.getProfileInformationData[0].imageResult);
    }
  }
  getFileName(docPath) {
    var result = docPath.split('\\');
    return result[result.length-1]
  }

  getImage() {
    if (this.selectedImage == null || this.selectedImage == undefined || this.selectedImage == '') {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      let imageUrl; //rename imageFileBinary to imageUrl
      let imageBinary = this.selectedImage; //image binary data response from api
      imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
      return imageUrl;
    }
  }

  removeFile() {
    this.getProfileInformationData[0].imageResult = "";
  }

  getFileExtension(OtheAttachment) { // this will give you icon class name
    let ext = OtheAttachment.split(".").pop();
    let obj = this.iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      let icon = obj[0].icon;
      return icon;
    } else {
      return "";
    }
  }
  onBack(){
    localStorage.setItem('current-step', "7");
    this.router.navigate(['customer/other-attachments'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
  }

  onNext(command) {
    this.submitted = true;
    localStorage.setItem('current-step', "9");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 9) {
      localStorage.setItem('completed-steps', "8");
    }
    this.toastMsg.success('Data saved successfully');
    if (command == "Continue") {
      this.router.navigate(['customer/consent'], { queryParams: { CustomerProfileId: this.CustomerProfileId } })
    }
    else {
      this.CreateResumeIfProflieChanged();
    }
  }


  CreateResumeIfProflieChanged() {
    this.apiService.get('Customer/CreateResume/' + this.iApplyUser.customerId)
      .subscribe(data => {
        if (data) {
        }
      })
  }

  getAllData(){
    this.apiService.get('CustomerProfile/Details/'+this.CustomerProfileId)
    .subscribe(data => {
      if (data) {
        this.getProfileInformationData = data.result.ProfileInformation
        this.getExperienceData = data.result.JobExperiance
        this.getCertificatesData = data.result.Certificates
        this.getAchievementsData = data.result.Achievements
        this.getSummaryData = data.result.Summery
        this.getSocialProfileData = data.result.SocialProfiles
        this.getEducationData = data.result.Education
        this.getProjectDetailsData = data.result.Projects
        this.getPatentsData = data.result.Patents
        this.getLanguageData = data.result.Language
        this.getAdditionalInformationData = data.result.AdditionalInformation
        this.getPortfolioData = data.result.Portfolio
        this.getPreferredJobData = data.result.JoDetails
        this.getPreferredSkillsData = data.result.SkillDetails
        this.getJobCateoryData = data.result.JobCategory
        // this.getJobIndustryData = data.result.JobCategory
        this.getJobCountryData = data.result.JobCountry
        for (var i = 0; i < this.getJobCountryData.result.length; i++) {
          this.areYouAuthorizedCountry = this.getJobCountryData[0].authorizedCountry
          }
        this.getExpectedSalaryData = data.result.Salary
        this.getOtherAttachmentsData = data.result.DocumentLink
        for (var i = 0; i < this.getOtherAttachmentsData.length; i++) {
        this.documentType = this.getOtherAttachmentsData[i].documentType
        }

      }
    })
  }

  clickTab(stepValue) {
    this.step = stepValue;

    if (stepValue == 2)
    {
      localStorage.setItem('current-step', "2");
      this.router.navigate(['customer/personal-profile'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }

    if (stepValue == 3) {
      localStorage.setItem('current-step', "3");
      this.router.navigate(['customer/experience'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 4) {
      localStorage.setItem('current-step', "4");
      this.router.navigate(['customer/education'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 5) {
      localStorage.setItem('current-step', "5");
      this.router.navigate(['customer/other-details'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 6) {
      localStorage.setItem('current-step', "6");
      this.router.navigate(['customer/job-preference'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 7) {
      localStorage.setItem('current-step', "7");
      this.router.navigate(['customer/other-attachments'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 8) {
      localStorage.setItem('current-step', "8");
      this.router.navigate(['customer/review'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 9) {
      localStorage.setItem('current-step', "9");
      this.router.navigate(['customer/consent'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
    if (stepValue == 10) {
      localStorage.setItem('current-step', "10");
      this.router.navigate(['customer/selectPlan'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    }
  }

}
