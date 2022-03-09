import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown';
import { AlertModule } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { AnyRecordWithTtl } from 'dns';

@Component({
  selector: 'app-job-preference',
  templateUrl: './job-preference.component.html',
  styleUrls: ['./job-preference.component.scss']
})
export class JobPreferenceComponent implements OnInit {

  @ViewChild('dropdownRef', { static: false }) dropdownRef: AngularMultiSelect;
  @ViewChild('dropdownRef2', { static: false }) dropdownRef2: AngularMultiSelect;
  @ViewChild('otherJtFocus') otherJtFocus: ElementRef;
  preferredJobTitleForm: FormGroup;
  jobCategoryForm: FormGroup;
  preferredSkillsForm: FormGroup;
  expectedSalaryForm: FormGroup;

  preferredJobTitleList: any = [];
  jobCategoryList: any = [];
  jobTitleList: any = [];
  preferredSkillsList: any = [];
  expectedSalaryList: any = [];
  CustomerSalary: any = [];

  selectedPreferredJobTitleAllList: any;
  preferredJobTitleAllList: any = [];
  selectedItems = [];
  PreferredJobTitleSettings = {};
  preferredJobTitleOther = { "jobTitle": "Other" };

  isPreferredJobTitleOtherYes: boolean = false;
  isPreferredSkillOtherYes: boolean = false;

  selectedPreferredSkillAllList: any;
  preferredSkillAllList: any = [];
  // selectedItems = [];
  PreferredSkillSettings = {};
  preferredSkillOther = { "skillName": "Other" };

  CustomerProfileId: any;
  currentUser;
  submitted = false;
  formData;

  preferredJobTitleArray = [];
  preferredSkillsArray = [];

  PreferredJobTitlePayloadArray = [];
  PreferredSkillsPayloadArray = [];

  countryList = [];
  countrySettings = {};
  selectedItemsCountry = [];
  SelectedCountryArray = [];
  dropdownList: any;
  LinkedInProfile: any;
  ResumeProfile: any;
  categoryList: any [];
  jobSubCateggoryList: any[];
  industryList: any [];
  currencyList: any[];
  temp: any[];
  customerJobTitle: any[];
  SalaryFrom: any;
  SalaryTo: any;
  iApplyUser;
  SubscriptionCancel: boolean = false;
  PaymentInfo;
  completedStep: any = 0;
  resumeContext: any;
  personalProfile: any;temp1: any[];
  SubscriberMasterDetails: any;
  JobTitleAllow: any;
  TotalJobApplied: any;
  JobLocation: any;
  hasChange: boolean = false;
  form: any;
  deleteSection:any;
  deleteItem:any;
  deleteId:any;
  jobtitle:any;
  ParseResume: any;


  editJobTitle: boolean = false;
  currentJobTitle: any[];

  editJobCategory: boolean = false;
  currentJobCategory: any;

  editSkills: boolean = false;
  currentSkills: any[];

  currentExpectSalary: any;
  currentJobCountry: any[];
  CustomerJobCountryList: any;
  editsalary: boolean;
  CustomerSalaryId: number;
  CustomerJobCategoryId: number;

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

deleteModal(item=0, index=0, sectionName=""){
  this.deleteItem = item;
  this.deleteId = index;
  this.deleteSection = sectionName;
  $('#deleteJobPreference').modal('show');
}

deleteItemFunc(){
  if(this.deleteSection == 'jobCategory'){
    this.deleteJobCategoryData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'jobtitle'){
    this.deleteJobPreferenceData();
  }
  if(this.deleteSection == 'preferredSkills'){
    this.deletePreferredSkillsData();
  }
  if(this.deleteSection == 'expectedSalary'){
   this.deleteExpectedSalaryData();
  }
  $('#deleteJobPreference').modal('hide');

}

  onCreateGroupFormValueChange(){

    this.hasChange = this.getDirtyValues(this.preferredJobTitleForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.jobCategoryForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.preferredSkillsForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.expectedSalaryForm);
    if(this.hasChange){
      return null;
    }
  }

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
    localStorage.setItem('step', "6");
    this.getDropDowns();
    this.getPreferredJobTitle();

  this.getPreferredSkills();
    this.PreferredJobTitleSettings = {
      text: "Select Preferred Job Title",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      primaryKey: "jobId",
      labelKey: "jobTitle",
      noDataLabel: "Search Preferred Job Title",
      enableSearchFilter: true,
      addNewItemOnFilter: true,
      multiple:true,
      searchable:true,
      autoPosition: false,
      searchBy: ['jobTitle'],
      searchMaxLimit: 20,
      escapeToClose: true,
      lazyLoading: true,
    };

    this.PreferredSkillSettings = {
      text: "Select Preferred Skills",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      primaryKey: "skillId",
      labelKey: "skillName",
      noDataLabel: "Search Preferred Skills",
      enableSearchFilter: true,
      autoPosition: false,
      lazyLoading: true,
      escapeToClose: true,
      searchBy: ['skillName']
    };

    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.preferredJobTitleForm = this.formBuilder.group({
      JobId: ['',[Validators.required]],
      OtherJobTitle: ['',[Validators.required]]
    });

    this.jobCategoryForm = this.formBuilder.group({
      JobCategoryId: ['',[Validators.required]],
      JobTypeId: ['',[Validators.required]],
      JobIndustryId: ['',[Validators.required]],
      JobCountryId: ['',[Validators.required]],
      AuthorizedCountry: ['']
    });

    this.preferredSkillsForm = this.formBuilder.group({
      SkillId: [''],
      OtherSkillName: [''],
    });

    this.expectedSalaryForm = this.formBuilder.group({
      SalaryFrom: ['',[Validators.pattern("^[0-9]*$")]],
      SalaryTo: ['',[Validators.pattern("^[0-9]*$")]],
      CurrencyId: ['']
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
      // console.log(this.CustomerProfileId);
    });

    if (this.CustomerProfileId == 0 || this.CustomerProfileId == undefined) {
      this.getPersonalProfile();
    }

    this.countrySettings = {
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      primaryKey: "id",
      labelKey: "name",
      noDataLabel: "Search Country",
      enableSearchFilter: true,
      autoPosition: false,
      searchBy: ['name']
    };

    if (localStorage.getItem("LinkedInProfile")) {
      this.LinkedInProfile = JSON.parse(localStorage.getItem("LinkedInProfile"));
      this.addPreferredSkillsDetailsFromLinkedInProfile();
    }
    else {
      this.getJobPreferenceDetailsList();
    }
    this.getSubscriberMaster();
    if (localStorage.getItem("parsed-resume") != null) {
      this.ParseResume = JSON.parse(localStorage.getItem("parsed-resume"));
    }
         // Resume  Parser GET API
 if (this.completedStep <= 6 && this.ParseResume == null) {
  // call API and get stored resume from database
  this.apiService.get('CustomerProfile/GetResumeContent/'+ this.currentUser.customerId )
  .subscribe(data => {
    if (data.statusCode === "201" && data.result) {
      if (data.result != "") {
        localStorage.setItem('parsed-resume', data.result[0].resumeContent);
        localStorage.setItem('from-resume', "true");
      // this.fillContentFromResume();
      }
    }

  });
}
 else
 {
  this.fillContentFromResume();
}
  }

  fillContentFromResume() {
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep > 6) {
      return;
    }

    if (localStorage.getItem("parsed-resume") != 'null') {
      this.resumeContext = JSON.parse(localStorage.getItem("parsed-resume"));
    }
    var skillsCsv = "";
    try{
    var taxon =this.resumeContext["Value"]["ResumeData"]["SkillsData"][0]["Taxonomies"][0]["SubTaxonomies"];
    for (let index = 0; index < taxon.length; index++) {

      for (let i = 0; i < taxon[index].Skills.length; i++) {
        try{
          skillsCsv = skillsCsv + "," + taxon[index].Skills[i].Name;
        }catch(ex){}
    }

    }

    } catch(ex){}

    if (skillsCsv != ""){
      this.apiService.get('CustomerProfile/SkillsFromResume/' + skillsCsv)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          var skills;
          try {
            skills = data.result;
              try {
              var preferredSkillsDetails = {
                  SkillId: skills,
                  AddedBy: this.currentUser.customerId,
                  CustomerProfileId: this.CustomerProfileId,
                }
                var cloneObj = JSON.parse(JSON.stringify(preferredSkillsDetails));
                this.preferredSkillsList.push(cloneObj);
                this.preferredSkillsList = [...this.preferredSkillsList];
              } catch (ex) { }
            this.createPreferredSkillsArray();
          } catch (ex) {
          }
          this.temp = [...data.result];
        }
      });
    }
  }

  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.personalProfile = data.result;
          this.CustomerProfileId = this.personalProfile.customerProfileId;
        }
      })
  }

  getJobPreferenceDetailsList() {
    this.apiService.get('CustomerProfile/JobPreferenceDetails/' + this.currentUser.customerId)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.addJobPrefereceJobTitles(data.result.customerJobTitle);
          this.addJobPrefereceJobCategories(data.result.customerJobCategory);
          this.addJobPreferenceSkills(data.result.customerSkill);
          this.addJobPreferenceSalary(data.result.customerSalary);
          try {
            this.temp = [...data.result];
          } catch (e) { }
          this.fillContentFromResume();
        }
      })
  }

  addJobPrefereceJobTitles(jobTitleList) {
    var preferredJobTitleDetails = {};
    preferredJobTitleDetails = {
      CustomerProfileId: this.CustomerProfileId,
      JobId: jobTitleList,
      //OtherJobTitle: this.preferredJobTitleForm.controls.OtherJobTitle.value,
      AddedBy: this.currentUser.customerId,
    }
    var cloneObj = JSON.parse(JSON.stringify(preferredJobTitleDetails));
    this.preferredJobTitleList.push(cloneObj);
    this.preferredJobTitleList = [...this.preferredJobTitleList];
    console.log(this.preferredJobTitleList);
    this.preferredJobTitleForm.reset();
    this.createPreferredJobTitleArray();
  }

  addJobPrefereceJobCategories(jobCategoriesList) {

    for (var j = 0; j < jobCategoriesList.length; j++) {
      var jobCategoryDetails = {};
      var CustomerJobCountryList = [];
      var CustomerJobCountryItem = {};
      for (var i = 0; i < jobCategoriesList[j].customerJobCountry.length; i++) {
        const record = jobCategoriesList[j].customerJobCountry[i];
        CustomerJobCountryItem = {
          "CustomerProfileId": this.CustomerProfileId,
          "JobCountryId": record.jobCountryId,
          "AuthorizedCountry": record.authorizedCountry,
        }
        CustomerJobCountryList.push(CustomerJobCountryItem);
      }

      jobCategoryDetails = {
        CustomerProfileId: this.CustomerProfileId,
        JobCategoryId: jobCategoriesList[j].jobCategoryId,
        CustomerJobCategoryId : jobCategoriesList[j].customerJobCategoryId,
        JobTypeId: jobCategoriesList[j].jobTypeId,
        JobIndustryId: jobCategoriesList[j].jobIndustryId,
        AddedBy: this.currentUser.customerId,
        CustomerJobCountry: CustomerJobCountryList
      }
      var cloneObj = JSON.parse(JSON.stringify(jobCategoryDetails));
      this.jobCategoryList.push(cloneObj);
      this.jobCategoryList = [...this.jobCategoryList];
      console.log(this.jobCategoryList);
    }
    this.jobCategoryForm.reset();
  }

  addJobPreferenceSkills(skillsList) {
    var preferredSkillsDetails = {};
    preferredSkillsDetails = {
      CustomerProfileId: this.CustomerProfileId,
      SkillId: skillsList,
      AddedBy: this.currentUser.customerId,
    }
    var cloneObj = JSON.parse(JSON.stringify(preferredSkillsDetails));
    this.preferredSkillsList.push(cloneObj);
    this.preferredSkillsList = [...this.preferredSkillsList];
    console.log(this.preferredSkillsList);
    this.preferredSkillsForm.reset();
    this.createPreferredSkillsArray();

  }
  addJobPreferenceSalary(salaray) {
    for (var j = 0; j < salaray.length; j++) {
      debugger
      let CustomerSalaryItem = {
        "CustomerProfileId": this.CustomerProfileId,
        "SalaryFrom": salaray[0].salaryFrom,
        "SalaryTo": salaray[0].salaryTo,
        "CurrencyId": salaray[0].currencyId,
        "AddedBy": this.currentUser.customerId,
        "CustomerSalaryId": salaray[0].customerSalaryId,
      }

      let salaryItem = {
        CustomerProfileId: this.CustomerProfileId,
        CustomerSalaryId: salaray[0].customerSalaryId,
        AddedBy: this.currentUser.customerId,
      }
      if (this.CustomerSalary.length > 0) {
        this.deleteExpectedSalaryData();
      }
      this.CustomerSalary.push(CustomerSalaryItem);
      this.CustomerSalary = [...this.CustomerSalary];
      this.expectedSalaryForm.reset();


    }
  }


  addPreferredSkillsDetailsFromLinkedInProfile() {
    for (var i = 0; i < this.LinkedInProfile.skills.length; i++) {
      var si = [this.preferredSkillOther];
      var preferredSkillsDetails = {};
      preferredSkillsDetails = {
        CustomerProfileId: this.CustomerProfileId,
        //SkillId: this.preferredSkillsForm.controls.SkillId.value,
        SkillId: si,
        OtherSkillName: this.LinkedInProfile.skills[i].name,
         AddedBy: this.currentUser.customerId,
      }
      var cloneObj = JSON.parse(JSON.stringify(preferredSkillsDetails));
      this.preferredSkillsList.push(cloneObj);
      this.preferredSkillsList = [...this.preferredSkillsList];
      this.preferredSkillsForm.reset();
      this.createPreferredSkillsArray();
    }
  }

  getPreferredJobTitle() {

      this.apiService.get('CustomerProfile/JobDetails')
        .subscribe(data => {
          if (data.statusCode === "201" && data.result) {
            this.preferredJobTitleAllList = data.result
            this.preferredJobTitleAllList.push(this.preferredJobTitleOther);
             this.temp = [...data.result];
          }
        })

  }
  searchFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.jobTitle.toLowerCase().indexOf(val) !== -1 ||
        !val;

    });
   if(temp.length == 0)
    {
      var filtervalue = this.temp.filter(x => x.jobTitle == 'Other');
      this.preferredJobTitleAllList = filtervalue;
    }
    else
    {
    this.preferredJobTitleAllList = temp;
    }
}


  onSelectAll($event) {

  }
  onDeSelectAll($event) {

  }

  getDropDowns() {
    this.apiService.get('CustomerProfile/dropdowns')
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.dropdownList = data.result;
        this.categoryList = data.result.JobCategory;
        this.jobSubCateggoryList = data.result.JobType
        this.industryList = data.result.JobIndustry;
        this.currencyList = data.result.Currency;
        this.countryList = data.result.Country;
        // this.preferredJobTitleAllList = data.result.JobTitle;
      }
    })
  }


  getPreferredSkills() {
      this.apiService.get('CustomerProfile/SkillDetails')
        .subscribe(data => {
          if (data.statusCode === "201" && data.result) {
            this.preferredSkillAllList = data.result
            this.preferredSkillAllList.push(this.preferredSkillOther);
            this.temp1 = [...data.result];
          }
        })

  }
  searchFilterSkills(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp1 = this.temp1.filter(function (d) {
      return d.skillName.toLowerCase().indexOf(val) !== -1 ||

        !val;
    });
    if(temp1.length == 0)
    {
      var filtervalue = this.temp1.filter(x => x.skillName == 'Other');
      this.preferredSkillAllList = filtervalue;
    }
    else
    {
      this.preferredSkillAllList = temp1;
    }
}
  onItemSelect(item: any) {
    if ((item.jobTitle == "other") || (item.jobTitle == "Other")) {
      this.isPreferredJobTitleOtherYes = true;
       this.dropdownRef.closeDropdown();

      this.otherJtFocus.nativeElement.focus();
      //this.preferredJobTitleForm.controls.JobId.reset();
    }

    if ((item.skillName == "other") || (item.skillName == "Other")) {
      this.isPreferredSkillOtherYes = true;
      this.dropdownRef2.closeDropdown();
    }

    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    if ((item.jobTitle == "other") || (item.jobTitle == "Other")) {
      this.isPreferredJobTitleOtherYes = false;
    }

    if ((item.skillName == "other") || (item.skillName == "Other")) {
      this.isPreferredSkillOtherYes = false;
    }
    console.log(item);
    console.log(this.selectedItems);
  }
  resetJobTitle(){
    debugger
    var cloneObj = JSON.parse(JSON.stringify(this.currentJobTitle));
    this.addJobPrefereceJobTitles(cloneObj);

      //this.createPreferredJobTitleArray();
      this.editJobTitle = false;
  }
  editJobPreferenceData() {

    var selectedJobPreferences = [];
    for (var i = 0; i < this.preferredJobTitleList.length; i++) {
      for (var j = 0; j < this.preferredJobTitleList[i].JobId.length; j++) {
        selectedJobPreferences.push(this.preferredJobTitleList[i].JobId[j]);
      }
    }
    debugger
    this.currentJobTitle = [...selectedJobPreferences];
    this.editJobTitle = true;
    this.preferredJobTitleForm.controls.JobId.patchValue(selectedJobPreferences);
    //this.deleteJobPreferenceData();
    this.preferredJobTitleArray = [];
    this.preferredJobTitleList = [];
    this.preferredJobTitleList = [...this.preferredJobTitleList];
  }

  deleteJobPreferenceData() {
    if(this.preferredJobTitleList.length > 0){
      debugger
      let payload = {CustomerProfileId: this.CustomerProfileId, CustomerJobTitleId: '', AddedBy : this.preferredJobTitleList[0].AddedBy};
      this.preferredJobTitleList[0].JobId.forEach(element => {

        payload.CustomerJobTitleId = element.customerJobTitleId;
        this.apiService.post('CustomerProfile/DeleteCustomerJob_Title', payload)
        .subscribe(data => {
//this.currentJobTitle.CustomerJobTitleId=0;
        });
      });
    }
    this.preferredJobTitleArray = [];
    this.preferredJobTitleList = [];
    this.preferredJobTitleList = [...this.preferredJobTitleList];
  }
  getSubscriberMaster() {
    this.apiService.get('CustomerProfile/GetSubscriberMaster').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.SubscriberMasterDetails = data.result;
        this.JobTitleAllow = data.result.jobTitle_Allow;
        this.JobLocation = data.result.jobLocation_Allow;
        localStorage.setItem('SubscriberMaster', JSON.stringify(data.result));
      }
    }, err => {
      console.log(err);
    });
  }
  addPreferredJobTitleDetails() {
    this.isPreferredJobTitleOtherYes = false;
    let addedCount = 0;
    for (let m = 0; m < this.preferredJobTitleList.length; m++) {
      addedCount = addedCount + this.preferredJobTitleList[m].JobId.length;
    }
    for (var i = 0; i < this.preferredJobTitleForm.controls.JobId.value.length; i++) {
      var selectedJobId = this.preferredJobTitleForm.controls.JobId.value[i].jobId;
      for (var j = 0; j < this.preferredJobTitleList.length; j++) {
        for (var k = 0; k < this.preferredJobTitleList[j].JobId.length; k++) {
          if (this.preferredJobTitleList[j].JobId[k].jobId == selectedJobId) {
            if (selectedJobId) {
              this.preferredJobTitleForm.controls.JobId.value.splice(i, 1);
              this.toastMsg.error('One of the selected Job Titles has already been added.');
            }
          }
        }
      }
    }

    if ((this.preferredJobTitleForm.controls.JobId.value.length + addedCount) > this.JobTitleAllow) {
      this.toastMsg.error('You can add upto '+this.JobTitleAllow+' Job Titles only.');
      return;
    }

    if (this.preferredJobTitleForm.controls.JobId.value.length > 0) {
      console.log(this.preferredJobTitleForm.value);
      var preferredJobTitleDetails = {};
      preferredJobTitleDetails = {
        CustomerProfileId: this.CustomerProfileId,
        JobId: this.preferredJobTitleForm.controls.JobId.value,
        OtherJobTitle: this.preferredJobTitleForm.controls.OtherJobTitle.value,
         AddedBy: this.currentUser.customerId,
      }


            var cloneObj = JSON.parse(JSON.stringify(preferredJobTitleDetails));
            this.preferredJobTitleList.push(cloneObj);
            this.preferredJobTitleList = [...this.preferredJobTitleList];
            console.log(this.preferredJobTitleList);


      this.PreferredJobTitlePayloadArray = this.createPreferredJobTitlePayloadArray();

      let payload = {};
      payload = {
        CustomerProfileId: this.CustomerProfileId,
        CustomerJobTitle: this.PreferredJobTitlePayloadArray,
        CustomerJobCategory: null,
        CustomerSkill: null,
        CustomerSalary: null,
        AddedBy: this.currentUser.customerId
      };

      this.apiService.post('CustomerProfile/AddUpdateCustomerJob_Title', payload)
            .subscribe(data => {
      });

      this.preferredJobTitleForm.reset();
      this.createPreferredJobTitleArray();
      this.editJobTitle = false;

    }
  }

  createPreferredJobTitleArray() {
    this.preferredJobTitleArray = [];
    this.preferredJobTitleList.forEach(element => {
      element.JobId.forEach(ele => {
        if (ele.jobTitle != 'Other') {
          this.preferredJobTitleArray.push(ele.jobTitle);
        }
      });
      if (element.OtherJobTitle) {
        this.preferredJobTitleArray.push(element.OtherJobTitle);
      }
    });
  }

  addJobCategoryDetails() {
    // console.log(this.jobCategoryForm.value);
    // console.log(this.selectedItemsCountry);
    // var a=this.selectedItemsCountry;

    if (this.selectedItemsCountry.length > this.JobLocation) {
      this.toastMsg.error('You can add upto '+this.JobLocation+' countries only.');
      localStorage.setItem('current-step', "6");
      localStorage.setItem('completed-steps', "6");
      return;
    }

    var CustomerJobCountryList = [];
    var CustomerJobCountryItem = {};
    for (var i = 0; i < this.selectedItemsCountry.length; i++) {
      CustomerJobCountryItem = {
        "CustomerProfileId": this.CustomerProfileId,
        "JobCountryId": this.selectedItemsCountry[i].id,
        "AuthorizedCountry": this.jobCategoryForm.controls.AuthorizedCountry.value,
      }
      CustomerJobCountryList.push(CustomerJobCountryItem);
    }

    let jobCategoryDetails = {
      CustomerProfileId: this.CustomerProfileId,
      JobCategoryId: this.jobCategoryForm.controls.JobCategoryId.value,
      JobTypeId: this.jobCategoryForm.controls.JobTypeId.value,
      JobIndustryId: this.jobCategoryForm.controls.JobIndustryId.value,
      AuthorizedCountry: this.jobCategoryForm.controls.AuthorizedCountry.value,
      AddedBy: this.currentUser.customerId,
      CustomerJobCategoryId: this.currentJobCategory != undefined?this.currentJobCategory.CustomerJobCategoryId:0,
      /*CustomerJobCountry: {
      CustomerProfileId: this.CustomerProfileId,
      JobCountry: this.selectedItemsCountry,
      AuthorizedCountry: this.jobCategoryForm.controls.AuthorizedCountry.value,
      }*/
      CustomerJobCountry: CustomerJobCountryList
    }

    this.apiService.post('CustomerProfile/AddUpdateCustomerJob_Category', jobCategoryDetails)
    .subscribe(data => {
              if(this.currentJobCategory == undefined){
                jobCategoryDetails.CustomerJobCategoryId = parseInt(data.result)
              }
              debugger
              var cloneObj = JSON.parse(JSON.stringify(jobCategoryDetails));
              this.jobCategoryList.push(cloneObj);
              this.jobCategoryList = [...this.jobCategoryList];
              this.jobCategoryForm.reset();
    });
    this.editJobCategory = false;
  }

  getJobCategory(id) {
    for (var i = 0; i < this.dropdownList.JobCategory.length; i++) {
      if (this.dropdownList.JobCategory[i].id == id) {
        return this.dropdownList.JobCategory[i].name;
      }
    }
  }
  getJobType(id) {
    for (var i = 0; i < this.dropdownList.JobType.length; i++) {
      if (this.dropdownList.JobType[i].id == id) {
        return this.dropdownList.JobType[i].name;
      }
    }
  }
  getJobIndustry(id) {
    for (var i = 0; i < this.dropdownList.JobIndustry.length; i++) {
      if (this.dropdownList.JobIndustry[i].id == id) {
        return this.dropdownList.JobIndustry[i].name;
      }
    }
  }
  getJobCountry(id) {
    for (var i = 0; i < this.dropdownList.Country.length; i++) {
      if (this.dropdownList.Country[i].id == id) {
        return this.dropdownList.Country[i].name;
      }
    }
  }

  editJobCategoryData(row, i) {
    this.jobCategoryForm.patchValue({
      JobCategoryId: row.JobCategoryId,
      JobTypeId: row.JobTypeId,
      JobIndustryId: row.JobIndustryId
    });
    this.currentJobCategory = this.jobCategoryList[i];
    var selectedCountry = [];
    for (var j = 0; j < this.jobCategoryList[i].CustomerJobCountry.length; j++) {
      var CountryName = this.getJobCountry(this.jobCategoryList[i].CustomerJobCountry[j].JobCountryId);
      selectedCountry.push({ "id": this.jobCategoryList[i].CustomerJobCountry[j].JobCountryId, "name": CountryName });
      this.jobCategoryForm.controls.AuthorizedCountry.patchValue(this.jobCategoryList[i].CustomerJobCountry[j].AuthorizedCountry)
    }
    this.currentJobCountry = [...selectedCountry];
    this.editJobCategory = true;
    this.jobCategoryForm.controls.JobCountryId.patchValue(selectedCountry);
    this.jobCategoryList.splice(i, 1);
  }
  resetJobCategory(){

      let jobCountry = this.currentJobCountry;
      let jobCategory = this.currentJobCategory;
      var CustomerJobCountryList = [];
      var CustomerJobCountryItem = {};
      for (var i = 0; i < jobCountry.length; i++) {
        CustomerJobCountryItem = {
          "CustomerProfileId": this.CustomerProfileId,
          "JobCountryId": jobCountry[i].id,
          "AuthorizedCountry": jobCountry[i].AuthorizedCountry,
        }
        CustomerJobCountryList.push(CustomerJobCountryItem);
      }

      let jobCategoryDetails = {
        CustomerProfileId: this.CustomerProfileId,
        JobCategoryId: jobCategory.JobCategoryId,
        JobTypeId: jobCategory.JobTypeId,
        JobIndustryId: jobCategory.JobIndustryId,
        AuthorizedCountry: jobCategory.AuthorizedCountry,
        AddedBy: this.currentUser.customerId,
        CustomerJobCategoryId: this.currentJobCategory != undefined?this.currentJobCategory.CustomerJobCategoryId:0,
        /*CustomerJobCountry: {
        CustomerProfileId: this.CustomerProfileId,
        JobCountry: this.selectedItemsCountry,
        AuthorizedCountry: this.jobCategoryForm.controls.AuthorizedCountry.value,
        }*/
        CustomerJobCountry: CustomerJobCountryList
      }


      var cloneObj = JSON.parse(JSON.stringify(jobCategoryDetails));
      this.jobCategoryList.push(cloneObj);
      this.jobCategoryList = [...this.jobCategoryList];
      console.log(this.jobCategoryList);
      this.jobCategoryForm.reset();
      this.CustomerJobCategoryId =0;
      this.editJobCategory = false;

  }

  deleteJobCategoryData(row, i) {
    let jobCategory =  this.jobCategoryList[i];
    let payload = {CustomerProfileId: this.CustomerProfileId, CustomerJobCategoryId: jobCategory.CustomerJobCategoryId, AddedBy : jobCategory.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerJob_Category', payload)
        .subscribe(data => {
                  this.jobCategoryList.splice(i, 1);
                  // this.jobCategoryForm.reset();
                  this.currentJobCategory.CustomerJobCategoryId =0;

        });

        this.jobCategoryForm.reset();
        this.CustomerJobCategoryId =0;
  }


  editPreferredSkillsData() {
    var selectedSkills = [];
    for (var i = 0; i < this.preferredSkillsList.length; i++) {
      for (var j = 0; j < this.preferredSkillsList[i].SkillId.length; j++) {
        selectedSkills.push(this.preferredSkillsList[i].SkillId[j]);
      }
    }
    this.currentSkills = [...selectedSkills];
    this.preferredSkillsForm.controls.SkillId.patchValue(selectedSkills);
    this.editSkills = true;
    //this.deletePreferredSkillsData();
    this.preferredSkillsArray = [];
    this.preferredSkillsList = [];
    this.preferredSkillsList = [...this.preferredSkillsList];
  }

  resetPreferredSkills(){
    this.addJobPreferenceSkills(this.currentSkills)
    this.editSkills = false;
  }

  deletePreferredSkillsData() {
    let summary =  this.preferredSkillsList[0];

    if(this.preferredSkillsList.length > 0){

      let payload = {CustomerProfileId: this.CustomerProfileId, CustomerSkillId: '', AddedBy : this.preferredSkillsList[0].AddedBy};
      this.preferredSkillsList[0].SkillId.forEach(element => {

        payload.CustomerSkillId = element.CustomerSkillId;
        this.apiService.post('CustomerProfile/DeleteCustomerSkill', payload)
        .subscribe(data => {
          //this.currentSkills.SkillId =0;
        });
      });
    }

          this.preferredSkillsArray = [];
          this.preferredSkillsList = [];

          this.preferredSkillsList = [...this.preferredSkillsList];
   // });

  }


  addPreferredSkillsDetails() {
    this.isPreferredSkillOtherYes = false;
    var CheckUniqueValueList = []
    for (var i = 0; i < this.preferredSkillsForm.controls.SkillId.value.length; i++) {
      var foundFlag = false;
      var selectedSkillId = this.preferredSkillsForm.controls.SkillId.value[i].skillId;
      for (var j = 0; j < this.preferredSkillsList.length; j++) {
        for (var k = 0; k < this.preferredSkillsList[j].SkillId.length; k++) {
          if (this.preferredSkillsList[j].SkillId[k].skillId == selectedSkillId) {
            if (selectedSkillId) {
              this.preferredSkillsForm.controls.SkillId.value.splice(i, 1);
              this.toastMsg.error('One of the selected skills has already been added.');
            }
          }
        }
      }
    }

    if (this.preferredSkillsForm.controls.SkillId.value.length > 0) {
      var preferredSkillsDetails = {};
      preferredSkillsDetails = {
        CustomerProfileId: this.CustomerProfileId,
        SkillId: this.preferredSkillsForm.controls.SkillId.value,
        OtherSkillName: this.preferredSkillsForm.controls.OtherSkillName.value,
         AddedBy: this.currentUser.customerId,
      }

                var cloneObj = JSON.parse(JSON.stringify(preferredSkillsDetails));
                this.preferredSkillsList.push(cloneObj);
                this.preferredSkillsList = [...this.preferredSkillsList];
                console.log(this.preferredSkillsList);


     this.PreferredSkillsPayloadArray = this.createPreferredSkillsPayloadArray();

     let payload = {};
     payload = {
       CustomerProfileId: this.CustomerProfileId,
       CustomerJobTitle: null,
       CustomerJobCategory: null,
       CustomerSkill: this.PreferredSkillsPayloadArray,
       CustomerSalary: null,
       AddedBy: this.currentUser.customerId
     };

     this.apiService.post('CustomerProfile/AddUpdateCustomerSkill', payload)
           .subscribe(data => {
     });
     this.editSkills = false;
     this.preferredJobTitleForm.reset();
     this.createPreferredJobTitleArray();
    }
    this.preferredSkillsForm.reset();
    this.createPreferredSkillsArray();
  }

  createPreferredSkillsArray() {
    this.preferredSkillsArray = [];
    this.preferredSkillsList.forEach(element => {
      element.SkillId.forEach(ele => {
        if (ele.skillName != undefined) {
          if (ele.skillName != 'Other') {
            this.preferredSkillsArray.push(ele.skillName);
          }
        } else {
          this.preferredSkillsArray.push("");
        }
      });
      if (element.OtherSkillName) {
        this.preferredSkillsArray.push(element.OtherSkillName);
      }
    });
  }

  addExpectedSalaryDetails() {
    // var expectedSalaryDetails = {};
    // expectedSalaryDetails = {
    //   SalaryFrom: this.expectedSalaryForm.controls.SalaryFrom.value,
    //   SalaryTo: this.expectedSalaryForm.controls.SalaryTo.value,
    //   CurrencyId: this.expectedSalaryForm.controls.CurrencyId.value,
    //    AddedBy: this.currentUser.customerId,
    //   CustomerProfileId: this.CustomerProfileId
    // }
    // // var cloneObj = JSON.parse(JSON.stringify(expectedSalaryDetails));
    // // this.expectedSalaryList.push(cloneObj);
    // // this.expectedSalaryList = [this.expectedSalaryList];
    // if(this.expectedSalaryList.length==0){
    //   this.expectedSalaryList.push(expectedSalaryDetails);
    // }
    // console.log(this.expectedSalaryList);
    // this.expectedSalaryForm.reset();

    // var CustomerSalary=[];
    //var CustomerSalaryItem = {};
    // for(var i=0;i<this.selectedItemsCountry.length;i++)
    // {
    let CustomerSalaryItem = {
      "CustomerProfileId": this.CustomerProfileId,
      "SalaryFrom": this.expectedSalaryForm.controls.SalaryFrom.value,
      "SalaryTo": this.expectedSalaryForm.controls.SalaryTo.value,
      "CurrencyId": this.expectedSalaryForm.controls.CurrencyId.value,
      "AddedBy": this.currentUser.customerId,
      "CustomerSalaryId" :  this.currentExpectSalary?this.currentExpectSalary.CustomerSalaryId:0,
    }
    if (this.CustomerSalary.length > 0) {
     //this.deleteExpectedSalaryData();
    }
    this.apiService.post('CustomerProfile/AddUpdateCustomerSalary', CustomerSalaryItem)
    .subscribe(data => {
      if(!this.currentExpectSalary){
        CustomerSalaryItem.CustomerSalaryId = parseInt(data.result)
      }
      this.CustomerSalary.push(CustomerSalaryItem);
      this.CustomerSalary = [...this.CustomerSalary];
      this.expectedSalaryForm.reset();
      this.editsalary= false;
    });
  }

  setStatus(){
    var FromSal= this.expectedSalaryForm.controls.SalaryFrom.value;
    var ToSal = this.expectedSalaryForm.controls.SalaryTo.value;

    var FromintValue= parseInt(FromSal);
    var TointValue = parseInt(ToSal);
    // if(ToSal>FromSal) {
      if(FromintValue>TointValue||  FromintValue == null) {
      this.toastMsg.error("Please enter valid input");
      this.expectedSalaryForm.controls.SalaryTo.reset();
      this.expectedSalaryForm.controls.SalaryFrom.reset();
    }
  }


  getCurrencyName(id) {
    for (var i = 0; i < this.dropdownList.Currency.length; i++) {
      if (this.dropdownList.Currency[i].id == id) {
        return this.dropdownList.Currency[i].name;
      }
    }
  }

  editExpectedSalaryData() {
    for (var i = 0; i < this.CustomerSalary.length; i++) {
      this.expectedSalaryForm.controls.SalaryFrom.patchValue(this.CustomerSalary[i].SalaryFrom);
      this.expectedSalaryForm.controls.SalaryTo.patchValue(this.CustomerSalary[i].SalaryTo);
      this.expectedSalaryForm.controls.CurrencyId.patchValue(this.CustomerSalary[i].CurrencyId);
      this.currentExpectSalary =this.CustomerSalary[i];
    }
    this.CustomerSalary = [];
    this.CustomerSalary = [...this.CustomerSalary];
    this.editsalary = true;
   //this.deleteExpectedSalaryData();
  }

  resetExpectedSalary(){
    let salary = this.currentExpectSalary;
    let CustomerSalaryItem = {
      "CustomerProfileId": this.CustomerProfileId,
      "SalaryFrom": salary.SalaryFrom,
      "SalaryTo": salary.SalaryTo,
      "CurrencyId": salary.CurrencyId,
      "AddedBy": this.currentUser.customerId,
      "CustomerSalaryId":salary.CustomerSalaryId
    }

      this.CustomerSalary.push(CustomerSalaryItem);
      this.CustomerSalary = [...this.CustomerSalary];
      this.expectedSalaryForm.reset();
      this.editsalary = false;
  }



  deleteExpectedSalaryData() {
  let salary = this.CustomerSalary[0];
  let CustomerProfileId = this.expectedSalaryList[0] != undefined?this.expectedSalaryList[0].CustomerProfileId:this.CustomerProfileId;

  let payload = {CustomerProfileId: CustomerProfileId,
     CustomerSalaryId: salary.CustomerSalaryId,
      AddedBy : salary.AddedBy
    };

   let customerProfileId = this.CustomerProfileId;
     this.apiService.post('CustomerProfile/DeleteCustomerSalary', payload)
        .subscribe(data => {
            this.CustomerSalaryId =0;
            this.CustomerSalary = [];
            this.CustomerSalary = [...this.CustomerSalary];
        });

  }

  onBack() {
    localStorage.setItem('current-step', "5");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 5) {
      localStorage.setItem('completed-steps', "5");
    }
    this.router.navigate(['customer/other-details'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
  }

  onNext(command) {
    this.submitted = true;
    this.PreferredJobTitlePayloadArray = this.createPreferredJobTitlePayloadArray();
    this.PreferredSkillsPayloadArray = this.createPreferredSkillsPayloadArray();

    let payload = {};
    payload = {
      CustomerProfileId: this.CustomerProfileId,
      CustomerJobTitle: this.PreferredJobTitlePayloadArray,
      CustomerJobCategory: this.jobCategoryList,
      CustomerSkill: this.PreferredSkillsPayloadArray,
      CustomerSalary: this.CustomerSalary,
      AddedBy: this.currentUser.customerId
    };
    if(this.PreferredJobTitlePayloadArray.length == 0 ){
      this.toastMsg.error("Please add Job title.");
      return;
    }

    if (this.jobCategoryList.length == 0) {
      this.toastMsg.error("Please add job category.");
      return;
    }
    if (this.PreferredSkillsPayloadArray.length == 0) {
      this.toastMsg.error("Please add preferred skills.");
      return;
    }


    this.apiService.post('CustomerProfile/JobPreference', payload)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          var CustomerProfileId = data.result.customerProfileId;
          localStorage.setItem('current-step', "7");

          this.completedStep = localStorage.getItem('completed-steps');
          if (this.completedStep < 7) {
            localStorage.setItem('completed-steps', "6");
          }

          this.toastMsg.success('Job Preferences saved successfully.');
          if (localStorage.getItem("JobPreferenceStatus")) {
            localStorage.removeItem("JobPreferenceStatus");
          }
          if (command == "Continue") {
            this.router.navigate(['customer/other-attachments'], { queryParams: { CustomerProfileId: CustomerProfileId } });
          }
        } else {
          this.toastMsg.error('Failed to save Job Preferences.');
        }
      }, err => {
        console.log(err)
        this.toastMsg.error('Failed to save Job Preferences.');
      });
    }



  createPreferredJobTitlePayloadArray() {
    var tmpPreferredJobTitlePayloadArray = [];
    this.preferredJobTitleList.forEach(element => {
      element.JobId.forEach(ele => {
        if (ele.jobTitle !== "Other") {
          var tempCustomerJobTitle = {
            "CustomerProfileId": element.CustomerProfileId,
            "JobId": ele.jobId,
            "OtherJobTitle": null,
            "AddedBy": element.AddedBy
          }
          tmpPreferredJobTitlePayloadArray.push(tempCustomerJobTitle);
        }
      });
      if (element.OtherJobTitle) {
        var tempCustomerJobTitle = {
          "CustomerProfileId": element.CustomerProfileId,
          "JobId": 0,
          "OtherJobTitle": element.OtherJobTitle,
          "AddedBy": element.AddedBy
        }
        tmpPreferredJobTitlePayloadArray.push(tempCustomerJobTitle);
      }
    });
    return tmpPreferredJobTitlePayloadArray;
  }

  // createJobCategoryPayloadArray(){
  //   var tmpJobCategoryPayloadArray = [];
  //   var tmpCustomerJobCountry = [];

  //   this.jobCategoryList.forEach(element => {
  //         var tempJobCategory = {
  //           "CustomerProfileId": element.CustomerProfileId,
  //           "JobCategoryId": element.JobCategoryId,
  //           "JobTypeId": element.JobTypeId,
  //           "JobIndustryId": element.JobIndustryId,
  //           "AddedBy": element.AddedBy,
  //         }
  //         this.selectedItemsCountry.forEach(ele => {
  //         var tmpJobCountry={
  //           "CustomerProfileId": element.CustomerProfileId,
  //           "JobCountryId": ele.id,
  //           "AuthorizedCountry": ele.AuthorizedCountry
  //         }
  //         tmpCustomerJobCountry.push(tmpJobCountry);
  //       });
  //       tmpJobCategoryPayloadArray.push(tempJobCategory);
  //   });
  //   return tmpJobCategoryPayloadArray;
  // }



  createPreferredSkillsPayloadArray() {
    var tmpPreferredSkillsPayloadArray = [];

    this.preferredSkillsList.forEach(element => {
      element.SkillId.forEach(ele => {
        if (ele.skillName !== "Other") {
          var tempCustomerSkill = {
            "CustomerProfileId": element.CustomerProfileId,
            "SkillId": ele.skillId,
            "OtherSkillName": null,
            "AddedBy": element.AddedBy
          }
          tmpPreferredSkillsPayloadArray.push(tempCustomerSkill);
        }
      });
      if (element.OtherSkillName) {
        var tempCustomerSkill = {
          "CustomerProfileId": element.CustomerProfileId,
          "SkillId": 0,
          "OtherSkillName": element.OtherSkillName,
          "AddedBy": element.AddedBy
        }
        tmpPreferredSkillsPayloadArray.push(tempCustomerSkill);
      }
    });
    return tmpPreferredSkillsPayloadArray;
  }

  // createCustomerSalaryPayloadArray(){

  // }



}

