import { Component, HostListener, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { countryCodes } from '../../country-codes'
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from '../../../pending-changes.guard';

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
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  AchievementsDate:Date;
  Editor = ClassicEditor;
  totalExperienceForm: FormGroup;
  achievementsForm: FormGroup;
  certificatesForm: FormGroup;
  portfolioForm: FormGroup;
  socialProfilesForm: FormGroup;

  experienceList: any = [];
  achievementsList: any = [];
  certificatesList: any = [];
  portfolioList: any = [];
  socialProfileList: any = [];

  deletedExperienceList: any = [];
  deletedAchievementsList: any = [];
  deletedCertificatesList: any = [];
  deletedPortfolioList: any = [];
  deletedSocialProfileList: any = [];

  CustomerProfileId: any;
  currentUser;
  submitted = false;
  formData;

  IsFresher="No";
  IsFresherBoolean: boolean = false;
  //IsCurrentWorkingHere="No";
  IsCurrentWorkingHereBool: boolean = false;
   IsCurrentlyEnrolled: boolean = true;
  ToDate: any;
  FromDate: any;
  TotalExperience = 0;
  lastExperience = 0;
  CustomerExperienceId = 0;
  CustomerAchievementId = 0;
  CustomerCertificationId = 0;
  CustomerPortfolioId = 0;
  CustomerSocialProfileId = 0;

  TotalExperienceCalc = 0;

  months;
  years;
  days;
  weeks;
  dropdownList: any;
  LinkedInProfile: any;
  ResumeProfile: any;
  proficiencyTypeList: any [];
  countryList: any[];
  temp;

  SummaryForm: FormGroup;
  SummaryList: any = [];
  SummaryId: any;
  CustomerSummaryId = 0;
  deletedSummaryList: any = [];

  summaryInformationForm: FormGroup;
  additionalInformationList: any = [];
  deletedAdditionalInformationList: any = [];
  additionalInformationId = 0;
  completedStep: any = 0;
  iApplyUser;
  SubscriptionCancel: boolean = false;
  resumeContext: any;
  PaymentInfo;
  currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
  hasChange: boolean = false;
  form: any;
  deleteSection:any;
  deleteItem:any;
  deleteId:any;

  editSummary: boolean = false;
  currentSummary : any;
  editExperience:boolean = false;
  currentExperience:any;
  editAchievement : boolean = false;
  currentAchievement:any;
  editcertificate : boolean = false;
  currentCertificate:any;
  editPortfolio : boolean = false;
  currentPortfolio:any;
  editSocialProfile : boolean = false;
  currentSocialProfile:any;
  ParseResume: any;
  Description: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg: ToastrService, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
   // console.log(this.submitted);
    if(this.submitted){
      return true;
    }
    this.onCreateGroupFormValueChange();
    return !this.hasChange;
  }

  getDirtyValues(form: any) {
    let dirtyValues = {};

    Object.keys(form.controls)
        .forEach(key => {
            let currentControl = form.controls[key];

            if (currentControl.dirty) {
                if (currentControl.controls)
                    dirtyValues[key] = this.getDirtyValues(currentControl);
                else
                    dirtyValues[key] = currentControl.value;
            }
        });

    return !(Object.keys(dirtyValues).length === 0);
}
deleteModal(item, index, sectionName){
  this.deleteItem = item;
  this.deleteId = index;
  this.deleteSection = sectionName;
  $('#deleteExperince').modal('show');
}

deleteItemFunc(){
  if(this.deleteSection == 'summary'){
    this.deleteSummaryData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'experience'){
    this.deleteExperienceData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'achievement'){
    this.deleteAchievementsData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'certificates'){
    this.deleteCertificatesData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'portfolio'){
    this.deletePortfolioData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'socialProfile'){
    this.deleteSocialProfilesData(this.deleteItem, this.deleteId);
  }
  $('#deleteExperince').modal('hide');

}
  onCreateGroupFormValueChange(){

    this.hasChange = this.getDirtyValues(this.totalExperienceForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.achievementsForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.certificatesForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.portfolioForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.socialProfilesForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.SummaryForm);
  }

  ngOnInit(): void {
    $(document).ready(function() {
      $("#JobTitle").keypress(function(e) {
        var length = this.value.length;
        if (length >= 95 ) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
        }
      });
      $("#City").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45 ) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
        }
      });
      $("#CertificateName").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45 ) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
        }
      });
    });

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
    // this.TotalExperience=0;
    this.getDropDowns();
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.totalExperienceForm = this.formBuilder.group({
      TotalExperience: [''],
      IsFresher: [''],
      JobTitle: ['', [Validators.required]],
      CompanyName: ['', [Validators.required]],
      CountryId: ['', Validators.required],
      City: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      IsCurrentWorkingHere: [''],
      // FromDate: ['', [Validators.required]],
      FromDate: [''],
      ToDate: [''],
      Description: ['']
    });

    this.totalExperienceForm.controls.IsCurrentWorkingHere.setValue(this.IsCurrentWorkingHereBool);

    this.achievementsForm = this.formBuilder.group({
      AchievementsTitle: [''],
      AchievementsDate:[''],
      AchievementsDescription:['']
    });

    this.certificatesForm = this.formBuilder.group({
      CertificateName: [''],
      //OrganizationName: [''],
      IssuedOn:[''],
      //ValidDate:[''],
      Description:['']
    });

     const urlRegex = '^(http:\/\/www\.|HTTP:\/\/www\.|Http:\/\/www\.|Https:\/\/www\.|https:\/\/www\.|HTTPS:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';

    this.portfolioForm = this.formBuilder.group({
      Url: ['', Validators.pattern(urlRegex)]
    });

    this.socialProfilesForm = this.formBuilder.group({
      SocialProfileTypeId: [''],
      Url: ['', Validators.pattern(urlRegex)]
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
      // console.log(this.CustomerProfileId);
    });
    this.SummaryForm = this.formBuilder.group({
      Summery: ['']
    });
    if (localStorage.getItem("LinkedInProfile")) {
      this.LinkedInProfile = JSON.parse(localStorage.getItem("LinkedInProfile"));
      this.addCertificatesFromLinkedInProfile();
    }
    else if (localStorage.getItem("ResumeProfile") && localStorage.getItem("ExperienceStatus")) {
      this.ResumeProfile = JSON.parse(localStorage.getItem("ResumeProfile"));
      if (this.ResumeProfile.designition.length > 0) {
        this.totalExperienceForm.controls.JobTitle.setValue(this.ResumeProfile.designition[0]);
      }
      if (this.ResumeProfile.companiesWorkedAt.length > 0) {
        this.totalExperienceForm.controls.CompanyName.setValue(this.ResumeProfile.companiesWorkedAt[0]);
      }
    }
    else
    {
      this.getExperienceList();
      this.getAchievementList();
      this.getSummaryList();
      this.getCertificateList();
      this.getPortfolioList();
      this.getSocialProfileList();
    }
  }
  get contactInfo()
  {
    return this.totalExperienceForm.controls;
  }

  fillContentFromResume() {
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep > 2) {
      return;
    }

    if (localStorage.getItem("parsed-resume") != 'null') {
      this.resumeContext = JSON.parse(localStorage.getItem("parsed-resume"));
    }
    var experiences;
    var fromDatabaseAsWell = false;
    try {
      if (this.experienceList.length > 0) {
        fromDatabaseAsWell = true;
      }
      experiences = this.resumeContext["Value"]["ResumeData"]["EmploymentHistory"]["Positions"];
      for (let i = 0; i < experiences.length; i++) {
        try {
          var experienceDetails = {};
          var jobTitle, companyName, countryId, description, isCurrent, fromDate, toDate;
          try {
            if (fromDatabaseAsWell) {
              jobTitle = experiences[i]["JobTitle"]["Raw"] + " [FROM RESUME]";
            } else {
              jobTitle = experiences[i]["JobTitle"]["Raw"];
            }

          } catch (ex) { }
          try {
            companyName = experiences[i]["Employer"]["Name"]["Raw"];
          } catch (ex) { }
          try {
            countryId = this.findCountryUsingCode(experiences[i]["Employer"]["Location"]["CountryCode"]);
          } catch (ex) { }
          try {
            description = experiences[i]["Description"];
          } catch (ex) { }
          try {
            isCurrent = experiences[i]["IsCurrent"];
          } catch (ex) { }
          try {
            var parts = experiences[i]["StartDate"]["Date"].split('T');
            fromDate = parts[0];
          } catch (ex) { }
          try {
            var parts = experiences[i]["EndDate"]["Date"].split('T');
            toDate = parts[0];
          } catch (ex) { }

          experienceDetails = {
            CustomerProfileId: this.CustomerProfileId,
            JobTitle: jobTitle,
            CompanyName: companyName,
            CountryId:countryId,
            Description: description,
            IsCurrentWorkingHere: isCurrent,
            FromDate: fromDate,
            ToDate: toDate,
          }
          var cloneObj = JSON.parse(JSON.stringify(experienceDetails));
          this.experienceList.push(cloneObj);
          this.experienceList = [...this.experienceList];
        } catch (ex) { }
      }
    } catch (ex) { }

    this.calculateTotalExperience();

    // Fill achievements
    var achievements;
    try {
      achievements = this.resumeContext["Value"]["ResumeData"]["Achievements"];
      for (let i = 0; i < achievements.length; i++) {
        try {
          var achievementDetails = {};
          var achievementsTitle;
          try {
            achievementsTitle = achievements[i];
            achievementsTitle = achievementsTitle.length > 50 ? achievementsTitle.substring(0, 50 - 3) + "..." : achievementsTitle;
            description = achievements[i];
          } catch (ex) { }
          achievementDetails = {
            CustomerProfileId: this.CustomerProfileId,
            AchievementsTitle: achievementsTitle,
            Description: description,
            AddedBy: this.currentUser.customerId,
          }
          var cloneObj = JSON.parse(JSON.stringify(achievementDetails));
          this.achievementsList.push(cloneObj);
          this.achievementsList = [...this.achievementsList];
        } catch (ex) { }
      }
    } catch (ex) { }

    // Fill certifications
    var certs;
    try {
      certs = this.resumeContext["Value"]["ResumeData"]["Certifications"];
      for (let i = 0; i < certs.length; i++) {
        try {
          var certDetails = {};
          var certificateName, description,organizationName;
          try {
            certificateName = certs[i]["Name"];
            certificateName = certificateName.length > 50 ? certificateName.substring(0, 50 - 3) + "..." : certificateName;
          //  organizationName = certs[i]["Organization"];
          //   organizationName = organizationName.length > 50 ? organizationName.substring(0, 50 - 3) + "..." : organizationName;
            description = certificateName;
          } catch (ex) { }
          certDetails = {
            CustomerProfileId: this.CustomerProfileId,
            CertificateName: certificateName,
            //OrganizationName:organizationName,
            Description: description,
            AddedBy: this.currentUser.customerId,
          }
          var cloneObj = JSON.parse(JSON.stringify(certDetails));
          this.certificatesList.push(cloneObj);
          this.certificatesList = [...this.certificatesList];
        } catch (ex) { }
      }
    } catch (ex) { }

    // Fill



  }

  resetSummary(){
      let summary = this.currentSummary;
      let SummaryDetails = {
        CustomerProfileId: this.CustomerProfileId,
        Summery: summary.Summery,
        AddedBy: this.currentUser.customerId,
        CustomerSummeryId: summary.CustomerSummeryId
    }
    var cloneObj = JSON.parse(JSON.stringify(SummaryDetails));
    this.SummaryList.push(cloneObj);
    this.SummaryList = [...this.SummaryList];
    this.SummaryForm.reset();
    this.editSummary = false;
  }

  resetExperience(){
    let experience = this.currentExperience;
    let experienceDetails = {
      CustomerProfileId: this.CustomerProfileId,
      JobTitle: experience.JobTitle,
      CompanyName: experience.CompanyName,
      CountryId: experience.CountryId,
      City: experience.City,
      TotalExperience: experience.TotalExperienceCalc,
      Description: experience.Description,
      IsFresher: experience.IsFresher,
      IsCurrentWorkingHere: experience.IsCurrentWorkingHere,
      FromDate: experience.FromDate,
      ToDate: experience.ToDate,
      AddedBy: this.currentUser.customerId,
      CustomerExperienceId: experience.CustomerExperienceId
    }

    var cloneObj = JSON.parse(JSON.stringify(experienceDetails));
    this.experienceList.push(cloneObj);
    this.experienceList = this.experienceList.sort((a,b) =>{
      var keyA = new Date(a.FromDate),
          keyB = new Date(b.FromDate);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return -1;
    });
    this.experienceList = [...this.experienceList];
    this.totalExperienceForm.reset();
    experience.CustomerExperienceId=0;
    this.totalExperienceForm.controls.IsCurrentWorkingHere.setValue(this.IsCurrentWorkingHereBool);
    this.totalExperienceForm.controls.TotalExperience.setValue(this.humanDate(this.lastExperience));
    this.IsCurrentWorkingHereBool = false;
    this.currentExperience = undefined;
    this.editExperience = false;
  }

  resetAchievement(){
    let achievement = this.currentAchievement;
    this.currentAchievement = undefined;
    let achievementsDetails = {
      CustomerProfileId: this.CustomerProfileId,
      AchievementsTitle: achievement.AchievementsTitle,
      AchievementsDate: achievement.AchievementsDate,
      AchievementsDescription: achievement.AchievementsDescription,
      AddedBy: this.currentUser.customerId,
      CustomerAchievementId: this.CustomerAchievementId
    }

    var cloneObj = JSON.parse(JSON.stringify(achievementsDetails));
    this.achievementsList.push(cloneObj);
    this.achievementsList = this.achievementsList.sort((a,b) =>{
      var keyA = new Date(a.AchievementsDate),
          keyB = new Date(b.AchievementsDate);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return -1;
    });
    this.achievementsList = [...this.achievementsList];
    this.achievementsForm.reset();
    this.CustomerAchievementId=0;
    this.editAchievement = false;

  }
  resetCertificate(){
    let certificate = this.currentCertificate;
    let certificatesDetails = {
      CustomerProfileId: this.CustomerProfileId,
      CertificateName: certificate.CertificateName,
      //OrganizationName:certificate.OrganizationName,
      IssuedOn: certificate.IssuedOn,
      //ValidDate:certificate.ValidDate,
      Description: certificate.Description,
      AddedBy: this.currentUser.customerId,
      CustomerCertificationId: this.CustomerCertificationId
    }
    var cloneObj = JSON.parse(JSON.stringify(certificatesDetails));
    this.certificatesList.push(cloneObj);
    this.certificatesList = this.certificatesList.sort((a,b) =>{
      var keyA = new Date(a.IssuedOn),
          keyB = new Date(b.IssuedOn);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return -1;
    });
    this.certificatesList = [...this.certificatesList];
    this.certificatesForm.reset();
    this.CustomerCertificationId=0;
    this.currentCertificate = undefined;
    this.editcertificate = false;

  }
  resetPortfolio(){
    let portfolio = this.currentPortfolio;
    let portfolioDetails = {
      CustomerProfileId: this.CustomerProfileId,
      Url: portfolio.Url,
      AddedBy: this.currentUser.customerId,
      CustomerPortfolioId: this.CustomerPortfolioId
    }
    var cloneObj = JSON.parse(JSON.stringify(portfolioDetails));
    this.portfolioList.push(cloneObj);
    this.portfolioList = [...this.portfolioList];
    this.portfolioForm.reset();
    this.CustomerPortfolioId=0;
    this.editPortfolio = false;
    this.currentPortfolio = undefined;
  }
  resetSocialProfile(){
    let socialProfile = this.currentSocialProfile;
    let socialProfileDetails = {
      CustomerProfileId: this.CustomerProfileId,
      SocialProfileTypeId: socialProfile.SocialProfileTypeId,
      Url: socialProfile.Url,
      AddedBy: this.currentUser.customerId,
      CustomerSocialProfileId: this.CustomerSocialProfileId
    }

    var cloneObj = JSON.parse(JSON.stringify(socialProfileDetails));
    this.socialProfileList.push(cloneObj);
    this.socialProfileList = [...this.socialProfileList];
    this.socialProfilesForm.reset();
    this.CustomerSocialProfileId=0;
    this.editSocialProfile = false;
    this.currentSocialProfile = undefined;
  }
  getExperienceList() {
    this.apiService.get('CustomerProfile/Experience/' + this.currentUser.customerId)
      .subscribe(data => {
      if (data.statusCode === '201' && data.result) {
        console.log(data.result);
        this.completedStep = localStorage.getItem('completed-steps');
        if (this.completedStep > 3) {
          this.IsFresher = "yes";
        } else {
          this.IsFresher = "no";
        }

        for (let index = 0; index < data.result.length; index++) {
          this.IsFresher = "no";
          const exp = data.result[index];
          var experienceDetails = {};
          experienceDetails = {
            CustomerProfileId: exp.customerProfileId,
            JobTitle: exp.jobTitle,
            CompanyName: exp.companyName,
            CountryId: exp.countryId,
            City: exp.city,
            TotalExperience: exp.totalExperience,
            Description: exp.description,
            IsFresher: exp.isFresher,
            IsCurrentWorkingHere: exp.isCurrentWorkingHere,
            FromDate: exp.fromDate,
            ToDate: exp.toDate,
            CustomerExperienceId: exp.customerExperienceId
          }
          this.IsFresher = exp.isFresher;
          this.CustomerProfileId = exp.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(experienceDetails));
          this.experienceList.push(cloneObj);
          this.experienceList = this.experienceList.sort((a,b) =>{
            var keyA = new Date(a.FromDate),
                keyB = new Date(b.FromDate);
              // Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.experienceList = [...this.experienceList];
          this.calculateTotalExperience();
        }

        if (this.IsFresher == "yes") {
          this.IsFresherBoolean = true;
          this.totalExperienceForm.controls.IsFresher.setValue(true);
        } else {
          this.totalExperienceForm.controls.IsFresher.setValue(false);
          this.IsFresherBoolean = false;
        }
        if (localStorage.getItem("parsed-resume") != null) {
          this.ParseResume = JSON.parse(localStorage.getItem("parsed-resume"));
        }
        this.completedStep = localStorage.getItem('completed-steps');
        // Resume  Parser GET API
        if (this.completedStep < 3 && this.ParseResume == null) {
          // call API and get stored resume from database
          this.apiService.get('CustomerProfile/GetResumeContent/' + this.currentUser.customerId)
            .subscribe(data => {
              if (data.statusCode === "201" && data.result) {
                if (data.result != "") {
                  localStorage.setItem('parsed-resume', data.result[0].resumeContent);
                  localStorage.setItem('from-resume', "true");
                  this.fillContentFromResume();
                }
              }
            });
        }
        else {
          this.fillContentFromResume();
        }
      }
    })
  }

  getAchievementList() {
    this.apiService.get('CustomerProfile/Achievements/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const ach = data.result[index];
          var achievementDetails = {};
          achievementDetails = {
            CustomerProfileId: ach.customerProfileId,
            CustomerAchievementId: ach.customerAchievementId,
            AchievementsTitle: ach.achievementsTitle,
            AchievementsDate: ach.achievementsDate,
            AchievementsDescription: ach.achievementsDescription,
            AddedBy: this.currentUser.customerId
          }
          this.CustomerProfileId = ach.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(achievementDetails));
          this.achievementsList.push(cloneObj);
          this.achievementsList = this.achievementsList.sort((a,b) =>{
            var keyA = new Date(a.AchievementsDate),
                keyB = new Date(b.AchievementsDate);
              // Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.achievementsList = [...this.achievementsList];
        }
      }
    })
  }

  getSummaryList() {
    this.apiService.get('CustomerProfile/Summery/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const record = data.result[index];
          var summaryDetails = {};
          summaryDetails = {
            CustomerProfileId: record.customerProfileId,
            CustomerSummeryId: record.customerSummeryId,
            AddedBy: this.currentUser.customerId,
            Summery: record.summery
          }
          this.CustomerProfileId = record.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(summaryDetails));
          this.SummaryList.push(cloneObj);
          this.SummaryList = [...this.SummaryList];
        }
      }
    })
  }


  getCertificateList() {
    this.apiService.get('CustomerProfile/Certifcates/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const record = data.result[index];
          var certDetails = {};
          certDetails = {
            CustomerProfileId: record.customerProfileId,
            CustomerCertificationId: record.customerCertificationId,
            CertificateName : record.certificateName,
            //OrganizationName : record.organizationName,
            IssuedOn: record.issuedOn,
            //ValidDate:record.validDate,
            Description: record.description,
            AddedBy: this.currentUser.customerId
          }
          this.CustomerProfileId = record.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(certDetails));
          this.certificatesList.push(cloneObj);
          this.certificatesList = this.certificatesList.sort((a,b) =>{
            var keyA = new Date(a.IssuedOn),
                keyB = new Date(b.IssuedOn);
              // Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.certificatesList = [...this.certificatesList];
        }
      }
    })
  }

  getPortfolioList() {
    this.apiService.get('CustomerProfile/Portfolios/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const record = data.result[index];
          var portDetails = {};
          portDetails = {
            CustomerProfileId: record.customerProfileId,
            CustomerPortfolioId: record.customerPortfolioId,
            Url: record.url,
            AddedBy: this.currentUser.customerId
          }
          this.CustomerProfileId = record.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(portDetails));
          this.portfolioList.push(cloneObj);
          this.portfolioList = [...this.portfolioList];
        }
      }
    })
  }
  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }


  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }
  setStatus(){
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    var ToDateValue=new Date(this.totalExperienceForm.controls.ToDate.value);
    var FromDateValue=new Date(this.totalExperienceForm.controls.FromDate.value);
    let Todateyear= ToDateValue.getFullYear();
    let Fromdateyear= FromDateValue.getFullYear();
    if (this.totalExperienceForm.controls.ToDate.value > today) {
      this.totalExperienceForm.controls.ToDate.reset();
      this.toastMsg.error("To date must be less than today date");
    }
    else if(Todateyear < Fromdateyear)
    {
      this.totalExperienceForm.controls.ToDate.reset();
      this.toastMsg.error("To date must be less than From date");
    }
    else
    {
    var selectedDate = new Date(this.totalExperienceForm.controls.ToDate.value);
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.totalExperienceForm.controls.ToDate.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }
  }
  }
  setStatusAchievementsDate(){
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.achievementsForm.controls.AchievementsDate.value > today) {
      this.achievementsForm.controls.AchievementsDate.reset();
      this.toastMsg.error("Achievements date must be less than today date");
    }
    else
    {
    var selectedDate = new Date(this.achievementsForm.controls.AchievementsDate.value);
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.achievementsForm.controls.AchievementsDate.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }
  }
  }
  setStatusIssuedOn(){
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.certificatesForm.controls.IssuedOn.value > today) {
      this.certificatesForm.controls.IssuedOn.reset();
      this.toastMsg.error("Issued On date must be less than today date");
    }
    else
    {
    var selectedDate = new Date(this.certificatesForm.controls.IssuedOn.value );
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.certificatesForm.controls.IssuedOn.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }
  }
  }

  getSocialProfileList() {
    this.apiService.get('CustomerProfile/SocialProfiles/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const record = data.result[index];
          var spDetails = {};
          spDetails = {
            Url: record.url,
            CustomerProfileId: record.customerProfileId,
            CustomerSocialProfileId: record.customerSocialProfileId,
            SocialProfileTypeId: record.socialProfileTypeId,
            AddedBy: this.currentUser.customerId
          }
          this.CustomerProfileId = record.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(spDetails));
          this.socialProfileList.push(cloneObj);
          this.socialProfileList = [...this.socialProfileList];
        }
      }
    })
  }

  addCertificatesFromLinkedInProfile() {
    for (var i = 0; i < this.LinkedInProfile.certifications.length; i++) {
      var certificatesDetails = {};
      certificatesDetails = {
        CustomerProfileId: this.CustomerProfileId,
        CertificateName: this.LinkedInProfile.certifications[i].name,
        IssuedOn: this.LinkedInProfile.certifications[i].endMonthYear,
        Description: '',
        AddedBy: this.currentUser.customerId,
      }
      var cloneObj = JSON.parse(JSON.stringify(certificatesDetails));
      this.certificatesList.push(cloneObj);
      this.certificatesList = [...this.certificatesList];
      this.certificatesForm.reset();
    }
  }

  calculateTotalExperience() {
    this.TotalExperienceCalc = 0;
    for (let index = 0; index < this.experienceList.length; index++) {
      const exp = this.experienceList[index];
      var from = new Date(exp.FromDate);
      var to = new Date(exp.ToDate);
      if (exp.ToDate == "") {
        to = new Date();
      }
      var timeDiff = to.getTime() - from.getTime();
      var result = timeDiff / (1000 * 60 * 60 * 24);
      this.TotalExperienceCalc = this.TotalExperienceCalc + result;
    }

    this.TotalExperienceCalc = Math.round(this.TotalExperienceCalc + this.getCurrentExp());
    this.lastExperience = Math.round(this.TotalExperienceCalc);
    this.totalExperienceForm.controls.TotalExperience.setValue(this.humanDate(this.TotalExperienceCalc));
  }


  getCurrentExp() {

    this.FromDate = this.totalExperienceForm.controls.FromDate.value;
    this.ToDate = this.totalExperienceForm.controls.ToDate.value;
    if (this.FromDate == null || this.FromDate == "") {
      return 0;
    }
    if (this.ToDate == null || this.ToDate =="") {
      this.ToDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    }
    var date1 = new Date(this.FromDate);
    var date2 = new Date(this.ToDate);
    var time_difference = date2.getTime() - date1.getTime();
    var result = time_difference / (1000 * 60 * 60 * 24);
    return result;
  }

  onBack(){
    localStorage.setItem('current-step', "2");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 3) {
      localStorage.setItem('completed-steps', "2");
    }
    this.router.navigate(['customer/personal-profile'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
  }

  onNext(command){

    if (this.experienceList.length == 0 && this.IsFresher != "yes") {
      this.toastMsg.error("Please add experience details.");
      return;
    }

    // validate the experience details before saving
    for (let index = 0; index < this.experienceList.length; index++) {
      const exp = this.experienceList[index];
      if (!exp.hasOwnProperty("JobTitle")) {
        var counter = index + 1;
        this.toastMsg.error('Job title is missing for ' + counter + "  experience.");
        return;
      }
      if (exp.CompanyName == undefined || exp.CompanyName == '') {
        var counter = index + 1;
        this.toastMsg.error('Company name is missing for ' + counter + "  experience.");
        return;
      }
      if (exp.CountryId == undefined || exp.CountryId == '') {
        var counter = index + 1;
        this.toastMsg.error('Country is missing for ' + counter + "  experience.");
        return;
      }
      if (exp.Description == undefined || exp.Description == '') {
        var counter = index + 1;
        this.toastMsg.error('Description is missing for ' + counter + "  experience.");
        return;
      }
      if (exp.FromDate == undefined || exp.FromDate == '') {
        var counter = index + 1;
        this.toastMsg.error('From Date is missing for ' + counter + "  experience.");
        return;
      }
    }
    this.submitted = true;
    let payload = {};
    payload = { CustomerProfileId: this.CustomerProfileId, CustomerExperience: this.experienceList,
      CustomerAchievements: this.achievementsList, CustomerSummery: this.SummaryList, CustomerCertification: this.certificatesList,
      CustomerPortfolio: this.portfolioList, CustomerSocialProfile: this.socialProfileList,
      DeletedExperience: this.deletedExperienceList, DeletedAchievementsList: this.deletedAchievementsList, DeletedSummery: this.deletedSummaryList, DeletedCertificatesList: this.deletedCertificatesList,
      DeletedPortfolioList: this.deletedPortfolioList, DeletedSocialProfileList: this.deletedSocialProfileList };

      // payload = { CustomerProfileId: this.CustomerProfileId, CustomerExperience: this.experienceList,
      //   CustomerAchievements: this.achievementsList, CustomerCertification: this.certificatesList,
      //   CustomerPortfolio: this.portfolioList, CustomerSocialProfile: this.socialProfileList,
      //   DeletedExperience: this.deletedExperienceList, DeletedAchievementsList: this.deletedAchievementsList, DeletedSummery: this.deletedSummaryList, DeletedCertificatesList: this.deletedCertificatesList,
      //   DeletedPortfolioList: this.deletedPortfolioList, DeletedSocialProfileList: this.deletedSocialProfileList };
    this.apiService.post('CustomerProfile/ExperianceandOtherDetails', payload)
        .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          var CustomerProfileId=data.result.customerProfileId;
          this.toastMsg.success('Experience details saved successfully');
          if (localStorage.getItem("ExperienceStatus")) {
            localStorage.removeItem("ExperienceStatus");
          }
          localStorage.setItem('current-step', "4");
          this.completedStep = localStorage.getItem('completed-steps');
          if (this.completedStep < 4) {
            localStorage.setItem('completed-steps', "3");
          }
          if (command == "Continue") {
            this.router.navigate(['customer/education'], { queryParams: { CustomerProfileId: CustomerProfileId } });
          }
          else {
            this.experienceList = [];
            this.getExperienceList();
            this.achievementsList = [];
            this.getAchievementList();
            this.SummaryList=[];
            this.getSummaryList();
            this.certificatesList=[];
            this.getCertificateList();
            this.portfolioList=[];
            this.getPortfolioList();
            this.socialProfileList=[];
            this.getSocialProfileList();
          }

        } else {
          this.toastMsg.error('Failed to submit experience details.');
        }
      });
  }

  toggleJobExperienceDiv(event) {
    this.IsFresherBoolean = ! this.IsFresherBoolean;
    // console.log(event.target.value);
    if(event.target.checked){
      this.IsFresher="yes";
    }
    else{
      this.IsFresher="no";
    }
    // console.log(this.IsFresher);
  }

  toggleToDate(event){
     if(event.target.checked){
      this.IsCurrentWorkingHereBool = true;
      this.ToDate=new Date();
    }
    else{
      this.IsCurrentWorkingHereBool = false;
      this.ToDate=this.totalExperienceForm.controls.ToDate.value;
    }
    console.log(this.IsCurrentWorkingHereBool);
    console.log(this.ToDate);
  }

  addTotalExperience(){

    // var  ExpDescription=this.totalExperienceForm.value.Description;
    // if(ExpDescription == undefined ||  ExpDescription == null){
    //   this.Description=""
    // }
    // else{
    //   this.Description=this.totalExperienceForm.controls.Description.value;
    // }

    let experienceDetails = {
      CustomerProfileId: this.CustomerProfileId,
      JobTitle: this.totalExperienceForm.controls.JobTitle.value,
      CompanyName: this.totalExperienceForm.controls.CompanyName.value,
      CountryId: this.totalExperienceForm.controls.CountryId.value,
      City: this.totalExperienceForm.controls.City.value,
      TotalExperience: this.TotalExperienceCalc,
      Description:this.totalExperienceForm.controls.Description.value,
      IsFresher: this.totalExperienceForm.controls.IsFresher.value,
      IsCurrentWorkingHere: this.totalExperienceForm.controls.IsCurrentWorkingHere.value,
      FromDate: this.totalExperienceForm.controls.FromDate.value,
      ToDate: this.totalExperienceForm.controls.ToDate.value,
      AddedBy: this.currentUser.customerId,
      CustomerExperienceId: this.CustomerExperienceId
    }
    this.apiService.post('CustomerProfile/AddUpdateCustomerExperience', experienceDetails)
    .subscribe(data => {
          if(!this.CustomerExperienceId){
            experienceDetails.CustomerExperienceId = parseInt(data.result)
          }
          var cloneObj = JSON.parse(JSON.stringify(experienceDetails));
          this.experienceList.push(cloneObj);
          debugger
          this.experienceList = this.experienceList.sort((a,b) =>{
            var keyA = new Date(a.FromDate),
                keyB = new Date(b.FromDate);
              //Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.experienceList = [...this.experienceList];
          this.totalExperienceForm.reset();
          this.CustomerExperienceId=0;
          this.totalExperienceForm.controls.IsCurrentWorkingHere.setValue(this.IsCurrentWorkingHereBool);
          this.totalExperienceForm.controls.TotalExperience.setValue(this.humanDate(this.lastExperience));
          this.IsCurrentWorkingHereBool = false;
          this.currentExperience = undefined;
    });
    this.editExperience = false;

  }

  humanDate(d) {
    let months = 0, years = 0, days =0;
    if (d < 0) {
      return "";
    }
    if (d == 0) {
      return years + " years, " + months + " months and " + days + " days";
    }
    while (d) {
        if (d >= 365) {
          years++;
          d -= 365;
        } else if (d >= 30) {
          months++;
          d -= 30;
        } else {
          days++;
          d--;
        }
    };
    return years + " years, " + months + " months and " + days + " days";
  }

  addAchievements(){
    console.log(this.achievementsForm.value);
    let achievementsDetails = {
      CustomerProfileId: this.CustomerProfileId,
      AchievementsTitle: this.achievementsForm.controls.AchievementsTitle.value,
      AchievementsDate: this.achievementsForm.controls.AchievementsDate.value,
      AchievementsDescription: this.achievementsForm.controls.AchievementsDescription.value,
      AddedBy: this.currentUser.customerId,
      CustomerAchievementId: this.CustomerAchievementId
    }

    this.apiService.post('CustomerProfile/AddUpdateCustomerAchievements', achievementsDetails)
    .subscribe(data => {
          if(!this.CustomerAchievementId){
            achievementsDetails.CustomerAchievementId = parseInt(data.result)
          }
          //achievementsDetails.CustomerAchievementId = data['result'];
          var cloneObj = JSON.parse(JSON.stringify(achievementsDetails));
          this.achievementsList.push(cloneObj);
          this.achievementsList = this.achievementsList.sort((a,b) =>{
            var keyA = new Date(a.AchievementsDate),
                keyB = new Date(b.AchievementsDate);
              // Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.achievementsList = [...this.achievementsList];
          this.achievementsForm.reset();
          this.CustomerAchievementId=0;
          this.currentAchievement = undefined;
    });
    this.editAchievement = false;

  }

  addCertificates(){
    let certificatesDetails = {
      CustomerProfileId: this.CustomerProfileId,
      CertificateName: this.certificatesForm.controls.CertificateName.value,
      //OrganizationName : this.certificatesForm.controls.OrganizationName.value,
      IssuedOn: this.certificatesForm.controls.IssuedOn.value,
      //ValidDate: this.certificatesForm.controls.ValidDate.value,
      Description: this.certificatesForm.controls.Description.value,
      AddedBy: this.currentUser.customerId,
      CustomerCertificationId: this.CustomerCertificationId
    }
    this.apiService.post('CustomerProfile/AddUpdateCustomerCertification', certificatesDetails)
    .subscribe(data => {
              if(!this.CustomerCertificationId){
                certificatesDetails.CustomerCertificationId = parseInt(data.result)
              }
              var cloneObj = JSON.parse(JSON.stringify(certificatesDetails));
              this.certificatesList.push(cloneObj);
              this.certificatesList = this.certificatesList.sort((a,b) =>{
                var keyA = new Date(a.IssuedOn),
                    keyB = new Date(b.IssuedOn);
                  // Compare the 2 dates
                  if (keyA > keyB) return -1;
                  if (keyA < keyB) return 1;
                  return -1;
              });
              this.certificatesList = [...this.certificatesList];
              this.certificatesForm.reset();
              this.CustomerCertificationId=0;
              this.currentCertificate = undefined;
    });
    this.editcertificate = false;

  }

  addPortfolio(){
    let portfolioDetails = {
      CustomerProfileId: this.CustomerProfileId,
      Url: this.portfolioForm.controls.Url.value,
      AddedBy: this.currentUser.customerId,
      CustomerPortfolioId: this.CustomerPortfolioId
    }

    this.apiService.post('CustomerProfile/AddUpdateCustomerPortfolio', portfolioDetails)
    .subscribe(data => {
              if(!this.CustomerPortfolioId){
                portfolioDetails.CustomerPortfolioId = parseInt(data.result)
              }
              var cloneObj = JSON.parse(JSON.stringify(portfolioDetails));
              this.portfolioList.push(cloneObj);
              this.portfolioList = [...this.portfolioList];
              this.portfolioForm.reset();
              this.CustomerPortfolioId=0;
    });
    this.editPortfolio = false;

  }

  addSocialProfiles(){
    console.log(this.socialProfilesForm.value);
    let socialProfileDetails = {
      CustomerProfileId: this.CustomerProfileId,
      SocialProfileTypeId: this.socialProfilesForm.controls.SocialProfileTypeId.value,
      Url: this.socialProfilesForm.controls.Url.value,
      AddedBy: this.currentUser.customerId,
      CustomerSocialProfileId: this.CustomerSocialProfileId
    }

    this.apiService.post('CustomerProfile/AddUpdateCustomerSocialProfile', socialProfileDetails)
    .subscribe(data => {
              if(!this.CustomerSocialProfileId){
                socialProfileDetails.CustomerSocialProfileId = parseInt(data.result)
              }
              var cloneObj = JSON.parse(JSON.stringify(socialProfileDetails));
              this.socialProfileList.push(cloneObj);
              this.socialProfileList = [...this.socialProfileList];
              this.socialProfilesForm.reset();
              this.CustomerSocialProfileId=0;
    });
    this.editSocialProfile = false;
  }



  getDropDowns(){
    this.apiService.get('CustomerProfile/dropdowns')
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.dropdownList = data.result
        this.proficiencyTypeList = data.result.ProfileType;
        this.countryList = data.result.Country;

      }
    })
  }
  findCountry(CountryId: number) {
    if (CountryId == undefined) {
      return "";
    }
    var filter_array = this.dropdownList.Country.filter(x => x.id == CountryId);
    if (filter_array.length > 0) {
      return filter_array[0].name;
    }
  }

  findCountryUsingCode(countryCode: string) {
    var countryName = "";
    var filter_array = countryCodes.filter(x => x.code == countryCode);
    if (filter_array.length > 0) {
      countryName = filter_array[0].name;
    }
    if (countryName != "") {
      var countryIdList = this.dropdownList.Country.filter(x => x.id == countryName);
      if (countryIdList.length > 0) {
        return countryIdList[0].id;
      }
    }
    return 0;
  }

  findProfileType(SocialProfileTypeId: number)
  {
    var filter_array = this.dropdownList.ProfileType.filter(x => x.id == SocialProfileTypeId);
    return filter_array[0].name;
  }

  editExperienceData(row, i, experience_id) {


    if (!(this.totalExperienceForm.controls.JobTitle.value == "" || this.totalExperienceForm.controls.JobTitle.value == null))
    {
      this.resetExperience();
    }
    let isfresher = row.IsFresher?JSON.parse(row.IsFresher):false;
    let currentworking = row.IsCurrentWorkingHere?JSON.parse(row.IsCurrentWorkingHere):false;
    this.totalExperienceForm.patchValue({
      JobTitle: row.JobTitle,
      CompanyName: row.CompanyName,
      CountryId: row.CountryId,
      City: row.City,
      TotalExperience: this.humanDate(row.TotalExperience),
      Description: row.Description,
      IsFresher: isfresher,
      IsCurrentWorkingHere: currentworking,
      FromDate: row.FromDate,
      ToDate: row.ToDate
    });
    this.editExperience = true;
    this.currentExperience = this.experienceList[i];
    this.TotalExperienceCalc = row.TotalExperience;
    this.CustomerExperienceId = experience_id;
    this.IsCurrentWorkingHereBool = currentworking;
    this.totalExperienceForm.controls.IsCurrentWorkingHere.setValue(this.IsCurrentWorkingHereBool);
    this.experienceList.splice(i, 1);
    this.experienceList = this.experienceList.sort((a,b) =>{
      var keyA = new Date(a.FromDate),
          keyB = new Date(b.FromDate);
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return -1;
    });
  }

  deleteExperienceData(row, i){
   if(row.CustomerExperienceId == null || row.CustomerExperienceId == undefined)
    {
     this.experienceList.splice(i, 1);
     return;
    }

    let experience =  this.experienceList[i];
    let payload = {CustomerProfileId: experience.CustomerProfileId, CustomerExperienceId: experience.CustomerExperienceId, AddedBy : experience.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerExperience', payload)
        .subscribe(data => {
          this.experienceList.splice(i, 1);

          if (row.CustomerProfileId > 0) {
            var experienceDetails = {};
            experienceDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerExperienceId: row.CustomerExperienceId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(experienceDetails));
            this.deletedExperienceList.push(cloneObj);
            this.deletedExperienceList = [...this.deletedExperienceList];
            this.CustomerExperienceId=0;
          }
    });
  }

  editAchievementsData(row, i, achievement_id) {
    if(this.currentAchievement != undefined){
      this.resetAchievement();
    }
    debugger
    this.achievementsForm.patchValue({
      AchievementsTitle: row.AchievementsTitle,
      AchievementsDate: row.AchievementsDate,
      AchievementsDescription: row.AchievementsDescription,
    });
    this.currentAchievement = this.achievementsList[i];
    this.CustomerAchievementId = achievement_id;
    this.achievementsList.splice(i, 1);
    this.editAchievement = true;
  }

  deleteAchievementsData(row, i){
    if(row.CustomerAchievementId == null || row.CustomerAchievementId == undefined)
    {
      this.achievementsList.splice(i, 1);
      return;
    }

    let achievement =  this.achievementsList[i];
    let payload = {CustomerProfileId: achievement.CustomerProfileId, CustomerAchievementId: achievement.CustomerAchievementId, AddedBy : achievement.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerAchievements', payload)
        .subscribe(data => {
          this.achievementsList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var achDetails = {};
            achDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerAchievementId: row.CustomerAchievementId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(achDetails));
            this.deletedAchievementsList.push(cloneObj);
            this.deletedAchievementsList = [...this.deletedAchievementsList];
            this.CustomerAchievementId=0;
          }
    });
  }

  editCertificatesData(row, i, certificate_id) {
    if(this.currentCertificate != undefined){
      this.resetCertificate();
    }
    this.certificatesForm.patchValue({
      CertificateName: row.CertificateName,
      //OrganizationName:row.OrganizationName,
      IssuedOn: row.IssuedOn,
      //ValidDate:row.ValidDate,
      Description: row.Description,
    });
    this.currentCertificate = this.certificatesList[i];
    this.CustomerCertificationId = certificate_id;
    this.certificatesList.splice(i, 1);
    this.editcertificate = true;
  }

  deleteCertificatesData(row, i){
    if(row.CustomerCertificationId == null || row.CustomerCertificationId == undefined)
    {
      this.certificatesList.splice(i, 1);
      return;
    }

    let certificate =  this.certificatesList[i];
    let payload = {CustomerProfileId: certificate.CustomerProfileId, CustomerCertificationId: certificate.CustomerCertificationId, AddedBy : certificate.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerCertification', payload)
        .subscribe(data => {
          this.certificatesList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var certDetails = {};
            certDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerCertificationId: row.CustomerCertificationId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(certDetails));
            this.deletedCertificatesList.push(cloneObj);
            this.deletedCertificatesList = [...this.deletedCertificatesList];
          this.CustomerCertificationId=0;

          }
        });


  }

  editPortfolioData(row, i, portfolio_id) {
    if(this.currentPortfolio != undefined){
      this.resetPortfolio();
    }
    this.portfolioForm.patchValue({
      Url: row.Url,
    });
    this.currentPortfolio = this.portfolioList[i];
    this.CustomerPortfolioId = portfolio_id;
    this.portfolioList.splice(i, 1);
    this.editPortfolio = true;
  }

  deletePortfolioData(row, i){
    if(row.CustomerPortfolioId== null || row.CustomerPortfolioId == undefined)
    {
      this.portfolioList.splice(i, 1);
      return;
    }

    let portfolio =  this.portfolioList[i];
    let payload = {CustomerProfileId: portfolio.CustomerProfileId, CustomerPortfolioId: portfolio.CustomerPortfolioId, AddedBy : portfolio.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerPortfolio', payload)
        .subscribe(data => {
          this.portfolioList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var portDetails = {};
            portDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerPortfolioId: row.CustomerPortfolioId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(portDetails));
            this.deletedPortfolioList.push(cloneObj);
            this.deletedPortfolioList = [...this.deletedPortfolioList];
            this.CustomerPortfolioId=0;
                   }
      });
  }

  editSocialProfilesData(row, i, socialProfileId) {
    if(this.currentSocialProfile != undefined){
      this.resetSocialProfile();
    }
    this.socialProfilesForm.patchValue({
      SocialProfileTypeId: row.SocialProfileTypeId,
      Url: row.Url,
    });
    this.CustomerSocialProfileId = socialProfileId;
    this.currentSocialProfile = this.socialProfileList[i];
    this.socialProfileList.splice(i, 1);
    this.editSocialProfile = true;
  }

  deleteSocialProfilesData(row, i){
    if(row.CustomerSocialProfileId== null || row.CustomerSocialProfileId == undefined)
     {
      this.socialProfileList.splice(i, 1);
      return;
      }

    let socialProfile =  this.socialProfileList[i];
    let payload = {CustomerProfileId: socialProfile.CustomerProfileId, CustomerSocialProfileId: socialProfile.CustomerSocialProfileId, AddedBy : socialProfile.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerSocialProfile', payload)
        .subscribe(data => {
            this.socialProfileList.splice(i, 1);
            if (row.CustomerProfileId > 0) {
              var spDetails = {};
              spDetails = {
                CustomerProfileId: row.CustomerProfileId,
                CustomerSocialProfileId: row.CustomerSocialProfileId,
                IsDeleted: true
              }
              var cloneObj = JSON.parse(JSON.stringify(spDetails));
              this.deletedSocialProfileList.push(cloneObj);
              this.deletedSocialProfileList = [...this.deletedSocialProfileList];
              this.CustomerSocialProfileId=0;
            }
        });
  }

  setStatusFromDate() {
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.totalExperienceForm.controls.FromDate.value >= today) {
      this.totalExperienceForm.controls.FromDate.reset();
      this.toastMsg.error("From date must be less than today date");
    }
    else
    {
    var selectedDate = new Date(this.totalExperienceForm.controls.FromDate.value);
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.totalExperienceForm.controls.FromDate.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }

    }
    this.calculateTotalExperience();
  }

  addSummary(){
    let SummaryDetails = {
      CustomerProfileId: this.CustomerProfileId,
      Summery: this.SummaryForm.controls.Summery.value,
      AddedBy: this.currentUser.customerId,
      CustomerSummeryId: this.CustomerSummaryId
    }
    debugger;
    if(this.SummaryList.length==0)
    {
    this.apiService.post('CustomerProfile/AddUpdateCustomersummary', SummaryDetails)
        .subscribe(data => {
          if(parseInt(data.result))
            {
              SummaryDetails.CustomerSummeryId = parseInt(data.result);
            }

          var cloneObj = JSON.parse(JSON.stringify(SummaryDetails));
          this.SummaryList.push(cloneObj);
          this.SummaryList = [...this.SummaryList];
          this.SummaryForm.reset();
          this.CustomerSummaryId=0;
          this.editSummary = false;
        });

    }
    else{

      this.SummaryList[0].Summery=this.SummaryForm.controls.Summery.value;
      let summary = this.SummaryList[0];
      console.log('else customer summary id in the add', summary)
        SummaryDetails = {
          CustomerProfileId: this.CustomerProfileId,
          Summery: this.SummaryForm.controls.Summery.value,
          AddedBy: this.currentUser.customerId,
          CustomerSummeryId: summary.CustomerSummeryId
      }
      this.apiService.post('CustomerProfile/AddUpdateCustomersummary', SummaryDetails)
      .subscribe(data => {
        console.log(data)
      });
    }


  }


  editSummaryData(row, i, summaryId) {
    console.log(summaryId)
    this.SummaryForm.patchValue({
      Summery: row.Summery,
    });
    debugger;
    this.CustomerSummaryId = summaryId;
    this.currentSummary = this.SummaryList[i];
    this.SummaryList.splice(i, 1);
    this.editSummary = true;
  }

  deleteSummaryData(row, i) {
    if(row.CustomerSummeryId== null || row.CustomerSummeryId == undefined)
    {
      this.SummaryList.splice(i, 1);
      return;
    }

    let summary =  this.SummaryList[i];

    let payload = {CustomerProfileId: summary.CustomerProfileId, CustomerSummeryId: summary.CustomerSummeryId, AddedBy : summary.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomersummary', payload)
        .subscribe(data => {
          this.SummaryList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var SummaryDetails = {};
            SummaryDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerSummeryId: row.CustomerSummeryId,
              IsDeleted: true
            }
            this.CustomerSummaryId =0;

            var cloneObj = JSON.parse(JSON.stringify(SummaryDetails));
            this.deletedSummaryList.push(cloneObj);
            this.deletedSummaryList = [...this.deletedSummaryList];
          }
      });
  }

}

