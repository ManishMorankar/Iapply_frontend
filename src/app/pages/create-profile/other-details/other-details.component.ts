import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {

  projectForm: FormGroup;
  patentForm: FormGroup;
  languageForm: FormGroup;
  additionalInformationForm: FormGroup;

  projectList: any = [];
  patentList: any = [];
  languageList: any = [];
  additionalInformationList: any = [];

  deletedProjectList: any = [];
  deletedPatentList: any = [];
  deletedLanguageList: any = [];
  deletedAdditionalInformationList: any = [];


  projectId = 0;
  patentId = 0;
  languageId = 0;
  additionalInformationId = 0;
  personalProfile: any;
  CustomerProfileId =0;
  currentUser;
  submitted = false;
  formData;
  dropdownList: any;
  LinkedInProfile: any;
  proficencyList: any[];
  completedStep: any = 0;
  iApplyUser;
  SubscriptionCancel: boolean = false;
  resumeContext: any;
  PaymentInfo;
  hasChange: boolean = false;
  form: any;
  deleteSection:any;
  deleteItem:any;
  deleteId:any;
  editProject: boolean = false;
  currentProject : any;
  editPatent: boolean = false;
  currentPatent : any;
  editLanguage: boolean = false;
  currentLanguage : any;
  editAdditionalInformation: boolean = false;
  currentAdditionalInformation:any;
  ParseResume: any;




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
  $('#deleteOtherDetails').modal('show');
}

deleteItemFunc(){
  if(this.deleteSection == 'projectDetails'){
    this.deleteProjectDetailsData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'patentDetails'){
    this.deletePatentDetailsData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'language'){
    this.deleteLanguagesData(this.deleteItem, this.deleteId);
  }
  if(this.deleteSection == 'additionalData'){
    this.deleteAdditionalInformationData(this.deleteItem, this.deleteId);
  }
  $('#deleteOtherDetails').modal('hide');
}

  onCreateGroupFormValueChange(){

    this.hasChange = this.getDirtyValues(this.projectForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.patentForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.languageForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.additionalInformationForm);
  }

  ngOnInit(): void {

    $(document).ready(function() {
      $("#Language").keypress(function(e) {
        var length = this.value.length;
        if (length >= 95 ) {
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
    this.getDropDowns();
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
    //const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.][0-9.]{2,100})[/\\w .-]*/?';
    const url= /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.projectForm = this.formBuilder.group({
      ProjectTitle: [''],
      ProjectUrl: ['',Validators.pattern(url)],
      // ProjectUrl: [''],
      ProjectDescription: ['']
    });
    this.patentForm = this.formBuilder.group({
      PatentName: [''],
      // PatentNumber: ['',Validators.pattern('/^[a-zA-Z][0-9]{8,30}*$/')],
      PatentNumber: [''],
      DateAwarded:[''],
      PatentUrl: [''],
    });

    this.languageForm = this.formBuilder.group({
      Language: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      ProficiencyId:['',[Validators.required]],
    });

    this.additionalInformationForm = this.formBuilder.group({
      AdditionalInfo: ['']
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
      // console.log(this.CustomerProfileId);
    });

    if (this.CustomerProfileId == 0 || this.CustomerProfileId == undefined) {
      this.getPersonalProfile();
    } else {
      this.getProjectList();
      this.getLanguageList();
      this.getPatentList();
      this.getAdditionalInfoList();
      //this.fillContentFromResume();
    }
    if (localStorage.getItem("parsed-resume") != null) {
      this.ParseResume = JSON.parse(localStorage.getItem("parsed-resume"));
    }

         // Resume  Parser GET API
 if (this.completedStep <= 4 && this.ParseResume == null) {
  // call API and get stored resume from database
  this.apiService.get('CustomerProfile/GetResumeContent/'+ this.currentUser.customerId )
  .subscribe(data => {
    if (data.statusCode === "201" && data.result) {
      if (data.result != "") {
        localStorage.setItem('parsed-resume', data.result[0].resumeContent);
        localStorage.setItem('from-resume', "true");
        //this.fillContentFromResume();
      }
    }

  });
}
 else
 {
  this.fillContentFromResume();
}
    if (localStorage.getItem("LinkedInProfile")) {
      this.LinkedInProfile = JSON.parse(localStorage.getItem("LinkedInProfile"));
      this.addProjectDetailsFromLinkedInProfile();
    }

  }

  fillContentFromResume() {
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep > 4) {
      return;
    }

    if (localStorage.getItem("parsed-resume") != 'null') {
      this.resumeContext = JSON.parse(localStorage.getItem("parsed-resume"));
    }
    var langs;
    try {
      langs = this.resumeContext["Value"]["ResumeData"]["LanguageCompetencies"];
      for (let i = 0; i < langs.length; i++) {
        try {
          var langDetails = {};
          var langName;
          try {
            langName = langs[i]["Language"];
          } catch (ex) { }
          langDetails = {
            CustomerProfileId: this.CustomerProfileId,
            Language: langName,
            AddedBy: this.currentUser.customerId,
          }
          var cloneObj = JSON.parse(JSON.stringify(langDetails));
          this.languageList.push(cloneObj);
          this.languageList = [...this.languageList];
        } catch (ex) { }
      }
    } catch (ex) { }

  }
  setStatus(){
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.patentForm.controls.DateAwarded.value > today) {
      this.patentForm.controls.DateAwarded.reset();
      this.toastMsg.error("Awarded date must be less than today date");
    }
    else
    {
    var selectedDate = new Date(this.patentForm.controls.DateAwarded.value);
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.patentForm.controls.DateAwarded.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }

    }
  }
  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
        .subscribe(data => {
          if (data.statusCode === '201' && data.result) {
            this.personalProfile = data.result;
            this.CustomerProfileId =  this.personalProfile.customerProfileId;
            this.fillContentFromResume();
            this.getProjectList();
            this.getLanguageList();
            this.getPatentList();
            this.getAdditionalInfoList();
          }
        })
  }

  getProjectList() {
    this.apiService.get('CustomerProfile/ProjectOthers/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const project = data.result[index];
          var projectDetails = {};
          projectDetails = {
            CustomerProfileId: project.customerProfileId,
            CustomerProjectDetailsId: project.customerProjectDetailsId,
            ProjectTitle: project.projectTitle,
            ProjectUrl: project.projectUrl,
            ProjectDescription: project.projectDescription
          }
          this.CustomerProfileId = project.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(projectDetails));
          this.projectList.push(cloneObj);
          this.projectList = [...this.projectList];
        }
      }
    })
  }


  getLanguageList() {

    this.apiService.get('CustomerProfile/LanguageOthers/' + this.currentUser.customerId)
    .subscribe(data => {
      debugger
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const lang = data.result[index];
          var langDetails = {};
          langDetails = {
            CustomerProfileId: lang.customerProfileId,
            CustomerLanguageId: lang.customerLanguageId,
            Language: lang.language,
            ProficiencyId: lang.proficiencyId
          }
          var cloneObj = JSON.parse(JSON.stringify(langDetails));
          this.languageList.forEach((element, index) => {
              if(element.Language.toLowerCase() == cloneObj.Language.toLowerCase()){
                this.languageList.splice(index, 1);
                this.languageList = [...this.languageList];
              }

          });

            this.languageList.push(cloneObj);
            this.languageList = [...this.languageList];

        }
      }
    })
  }


  getPatentList() {
    this.apiService.get('CustomerProfile/PatentOthers/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const patent = data.result[index];
          var patentDetails = {};
          patentDetails = {
            CustomerProfileId: patent.customerProfileId,
            CustomerPatentDetailsId: patent.customerPatentDetailsId,
            PatentName: patent.patentName,
            PatentNumber: patent.patentNumber,
            DateAwarded: patent.dateAwarded,
            PatentUrl: patent.patentUrl
          }
          this.CustomerProfileId = patent.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(patentDetails));
          this.patentList.push(cloneObj);
          this.patentList = this.patentList.sort((a,b) =>{
            var keyA = new Date(a.DateAwarded),
                keyB = new Date(b.DateAwarded);
              // Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.patentList = [...this.patentList];
        }
      }
    })
  }

  getAdditionalInfoList() {
    this.apiService.get('CustomerProfile/AdditionalInfoOthers/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const additionalInfo = data.result[index];
          var additionalInfoDetails = {};
          additionalInfoDetails = {
            CustomerProfileId: additionalInfo.customerProfileId,
            CustomerAdditionalInformationId: additionalInfo.customerAdditionalInformationId,
            AdditionalInfo: additionalInfo.additionalInfo
          }
          this.CustomerProfileId = additionalInfo.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(additionalInfoDetails));
          this.additionalInformationList.push(cloneObj);
          this.additionalInformationList = [...this.additionalInformationList];
        }
      }
    })
  }

    addProjectDetailsFromLinkedInProfile() {
      for (var i = 0; i < this.LinkedInProfile.projects.length; i++) {
        var projectDetails = {};
        projectDetails = {
          CustomerProfileId: this.CustomerProfileId,
          ProjectTitle: this.LinkedInProfile.projects[i].title,
          ProjectUrl: this.LinkedInProfile.projects[i].url,
          ProjectDescription: this.LinkedInProfile.projects[i].description,
          AddedBy: this.currentUser.customerId,
        }
        var cloneObj = JSON.parse(JSON.stringify(projectDetails));
        this.projectList.push(cloneObj);
        this.projectList = [...this.projectList];
        this.projectForm.reset();
      }
    }

  addProjectDetails(){
    console.log(this.projectForm.value);
    let projectDetails = {
      CustomerProfileId: this.CustomerProfileId,
      ProjectTitle: this.projectForm.controls.ProjectTitle.value,
      ProjectUrl: this.projectForm.controls.ProjectUrl.value,
      ProjectDescription: this.projectForm.controls.ProjectDescription.value,
      AddedBy: this.currentUser.customerId,
      CustomerProjectDetailsId: this.projectId
    }
    this.apiService.post('CustomerProfile/AddUpdateCustomerProjectDetails', projectDetails)
    .subscribe(data => {
        if(!this.projectId){
          projectDetails.CustomerProjectDetailsId = parseInt(data.result)
        }
        var cloneObj = JSON.parse(JSON.stringify(projectDetails));
        this.projectList.push(cloneObj);
        this.projectList = [...this.projectList];
        this.projectForm.reset();
        this.projectId=0;
    });
    this.editProject = false;
  }

  addPatentDetails(){
    let patentDetails = {
      CustomerProfileId: this.CustomerProfileId,
      PatentName: this.patentForm.controls.PatentName.value,
      PatentNumber: this.patentForm.controls.PatentNumber.value,
      DateAwarded: this.patentForm.controls.DateAwarded.value,
      PatentUrl: this.patentForm.controls.PatentUrl.value,
      AddedBy: this.currentUser.customerId,
      CustomerPatentDetailsId: this.patentId
    }
    this.apiService.post('CustomerProfile/AddUpdateCustomerPatentDetails', patentDetails)
    .subscribe(data => {
              if(!this.patentId){
                patentDetails.CustomerPatentDetailsId = parseInt(data.result)
              }
              var cloneObj = JSON.parse(JSON.stringify(patentDetails));
              this.patentList.push(cloneObj);
              this.patentList = this.patentList.sort((a,b) =>{
                var keyA = new Date(a.DateAwarded),
                    keyB = new Date(b.DateAwarded);
                  // Compare the 2 dates
                  if (keyA > keyB) return -1;
                  if (keyA < keyB) return 1;
                  return -1;
              });
              this.patentList = [...this.patentList];
              this.patentForm.reset();
              this.patentId=0;
              this.currentPatent = undefined;
    });
    this.editPatent = false;
  }

  addLanguageDetails(){
    let languageDetails = {
      CustomerProfileId: this.CustomerProfileId,
      Language: this.languageForm.controls.Language.value,
      ProficiencyId: this.languageForm.controls.ProficiencyId.value,
      AddedBy: this.currentUser.customerId,
      CustomerLanguageId: this.languageId
    }

    this.apiService.post('CustomerProfile/AddUpdateCustomerLanguage', languageDetails)
    .subscribe(data => {
            if(!this.languageId){
              languageDetails.CustomerLanguageId = parseInt(data.result)
            }
              var cloneObj = JSON.parse(JSON.stringify(languageDetails));
              this.languageList.push(cloneObj);
              this.languageList = [...this.languageList];
              this.languageForm.reset();
              this.languageId=0;
    });
    this.editLanguage = false;
  }

  addAdditionalInformation(){
    let additionalInformationDetails = {
      CustomerProfileId: this.CustomerProfileId,
      AdditionalInfo: this.additionalInformationForm.controls.AdditionalInfo.value,
      AddedBy: this.currentUser.customerId,
      CustomerAdditionalInformationId: this.additionalInformationId
    }
    this.apiService.post('CustomerProfile/AddUpdateCustomerAdditionalInformation', additionalInformationDetails)
    .subscribe(data => {
              if(!this.additionalInformationId){
                additionalInformationDetails.CustomerAdditionalInformationId = parseInt(data.result)
              }
              var cloneObj = JSON.parse(JSON.stringify(additionalInformationDetails));
              this.additionalInformationList.push(cloneObj);
              this.additionalInformationList = [...this.additionalInformationList];
              this.additionalInformationForm.reset();
    });
    this.editAdditionalInformation = false;
  }

  onBack() {
    localStorage.setItem('current-step', "4");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 4) {
      localStorage.setItem('completed-steps', "4");
    }
    this.router.navigate(['customer/education'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
  }

  onNext(command){
    this.submitted = true;
    console.log(this.projectForm.value);
    console.log(this.patentForm.value);
    console.log(this.languageForm.value);
    console.log(this.additionalInformationForm.value);
    for (var i = 0; i < this.languageList.length; i++) {
      if(this.languageList[i].ProficiencyId == undefined){
        this.toastMsg.error("Please select proficiency for language")
        return;
      }
    }
    if (this.languageList.length == 0) {
      localStorage.setItem('current-step', "6");
      localStorage.setItem('completed-steps', "5");
      this.toastMsg.error("Please add atleast one language")
      return;
    }

    let payload = {};
    payload = { CustomerProfileId: this.CustomerProfileId, CustomerProjectsDetails: this.projectList, CustomerPatentDetails: this.patentList,
      CustomerLanguage: this.languageList, CustomerAdditionalInformation: this.additionalInformationList,
      DeletedCustomerProjectsDetails: this.deletedProjectList, DeletedCustomerPatentDetails: this.deletedPatentList,
      DeletedCustomerLanguage: this.deletedLanguageList, DeletedCustomerAdditionalInformation: this.deletedAdditionalInformationList};
    this.apiService.post('CustomerProfile/ProjectsDetailsOthers', payload)
        .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          var CustomerProfileId=data.result.customerProfileId;
          this.toastMsg.success('Project and other details saved successfully');
          if (localStorage.getItem("OtherDetailsStatus")) {
            localStorage.removeItem("OtherDetailsStatus");
          }
          localStorage.setItem('current-step', "6");
          this.completedStep = localStorage.getItem('completed-steps');
          if (this.completedStep < 6) {
            localStorage.setItem('completed-steps', "5");
          }
         if (command == "Continue") {
            this.router.navigate(['customer/job-preference'], { queryParams: { CustomerProfileId: CustomerProfileId } });
          }
          else {
          this.projectList = [];
          this.getProjectList();
          this.languageList  = [];
          this.getLanguageList();
          this.patentList = [];
          this.getPatentList();
          this.additionalInformationList = [];
          this.getAdditionalInfoList();
          }
        }
        else {
          this.toastMsg.error('Failed to submit Other details.');
        }
      });
  }



  getDropDowns(){
    this.apiService.get('CustomerProfile/dropdowns')
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.dropdownList = data.result
        this.proficencyList = data.result.Proficiency;
      }
    })
  }
  findProficiency(ProficiencyId: number)
  {
    if (this.proficencyList == undefined) {
      return "";
    }
    var filter_array = this.proficencyList.filter(x => x.id == ProficiencyId);
    if (filter_array.length > 0) {
      return filter_array[0].name;
    }
    return "";
  }
  editProjectDetailsData(row, i, project_id) {
    this.editProject = true;
    this.projectForm.patchValue({
      ProjectTitle: row.ProjectTitle,
      ProjectUrl: row.ProjectUrl,
      ProjectDescription: row.ProjectDescription,
    });
    this.projectId = project_id;
    this.currentProject = this.projectList[i];
    this.projectId = row.CustomerProjectDetailsId;
    this.projectList.splice(i, 1);
  }
  resetProject(){
    let project = this.currentProject;

    let projectDetails = {
      CustomerProfileId: this.CustomerProfileId,
      ProjectTitle: project.ProjectTitle,
      ProjectUrl: project.ProjectUrl,
      ProjectDescription: project.ProjectDescription,
      AddedBy: this.currentUser.customerId,
      CustomerProjectDetailsId: this.projectId
    }

    var cloneObj = JSON.parse(JSON.stringify(projectDetails));
    this.projectList.push(cloneObj);
    this.projectList = [...this.projectList];
    this.projectForm.reset();

    this.editProject = false;
  }
  resetPatent(){
      let patent = this.currentPatent;
      let patentDetails = {
        CustomerProfileId: this.CustomerProfileId,
        PatentName: patent.PatentName,
        PatentNumber: patent.PatentNumber,
        DateAwarded: patent.DateAwarded,
        PatentUrl: patent.PatentUrl,
        AddedBy: this.currentUser.customerId,
        CustomerPatentDetailsId: this.patentId
      }

      var cloneObj = JSON.parse(JSON.stringify(patentDetails));
      this.patentList.push(cloneObj);
      this.patentList = [...this.patentList];
      this.patentForm.reset();

      this.editPatent = false;
  }
  resetLanguage(){
      let language = this.currentLanguage;
      let languageDetails = {
        CustomerProfileId: this.CustomerProfileId,
        Language: language.Language,
        ProficiencyId: language.ProficiencyId,
        AddedBy: this.currentUser.customerId,
        CustomerLanguageId: this.languageId
      }

      var cloneObj = JSON.parse(JSON.stringify(languageDetails));
      this.languageList.push(cloneObj);
      this.languageList = [...this.languageList];
      this.languageForm.reset();

      this.editLanguage = false;
  }
  resetAdditionalInformation(){
        let addtionalInfo = this.currentAdditionalInformation;

        let additionalInformationDetails = {
          CustomerProfileId: this.CustomerProfileId,
          AdditionalInfo: addtionalInfo.AdditionalInfo,
          AddedBy: this.currentUser.customerId,
          CustomerAdditionalInformationId: this.additionalInformationId
        }

        var cloneObj = JSON.parse(JSON.stringify(additionalInformationDetails));
        this.additionalInformationList.push(cloneObj);
        this.additionalInformationList = [...this.additionalInformationList];
        this.additionalInformationForm.reset();

        this.editAdditionalInformation = false;
  }

  deleteProjectDetailsData(row, i){

    if(row.CustomerProjectDetailsId == null || row.CustomerProjectDetailsId == undefined)
    {
     this.projectList.splice(i, 1);
     return;
    }
    let project =  this.projectList[i];

    let payload = {CustomerProfileId: project.CustomerProfileId, CustomerProjectDetailsId: project.CustomerProjectDetailsId, AddedBy : project.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerProjectDetails', payload)
        .subscribe(data => {
          this.projectList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var projectDetails = {};
            projectDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerProjectDetailsId: row.CustomerProjectDetailsId,
              IsDeleted: true
            }
            if (row.CustomerProjectDetailsId == 0) {
              return
            }
            var cloneObj = JSON.parse(JSON.stringify(projectDetails));
            this.deletedProjectList.push(cloneObj);
            this.deletedProjectList = [...this.deletedProjectList];
            this.projectId=0;
        }
      });
  }

  editPatentDetailsData(row, i, patent_id) {
    this.editPatent = true;
    this.patentForm.patchValue({
      PatentName: row.PatentName,
      PatentNumber: row.PatentNumber,
      DateAwarded: row.DateAwarded,
      PatentUrl: row.PatentUrl,
    });

    this.patentId = patent_id;
    this.editPatent = true;
    this.currentPatent = this.patentList[i];
    this.patentList.splice(i, 1);
  }

  deletePatentDetailsData(row, i){
    if(row.CustomerPatentDetailsId == null || row.CustomerPatentDetailsId == undefined)
    {
     this.patentList.splice(i, 1);
     return;
    }
    let patent =  this.patentList[i];

    let payload = {CustomerProfileId: patent.CustomerProfileId, CustomerPatentDetailsId: patent.CustomerPatentDetailsId, AddedBy : patent.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerPatentDetails', payload)
        .subscribe(data => {
          this.patentList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var patentDetails = {};
            patentDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerPatentDetailsId: row.CustomerPatentDetailsId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(patentDetails));
            this.deletedPatentList.push(cloneObj);
            this.deletedPatentList = [...this.deletedPatentList];
            this.patentId=0;
        }
    });


  }

  editLanguagesData(row, i, languageId) {
    this.editLanguage = true;
    this.languageForm.patchValue({
      Language: row.Language,
      ProficiencyId: row.ProficiencyId,
    });
    this.languageId = languageId;
    this.editLanguage = true;
    this.currentLanguage = this.languageList[i];
    this.languageList.splice(i, 1);
  }

  deleteLanguagesData(row, i){
    if(row.CustomerLanguageId == null || row.CustomerLanguageId == undefined)
    {
     this.languageList.splice(i, 1);
     return;
    }
    let language =  this.languageList[i];

    let payload = {CustomerProfileId: language.CustomerProfileId, CustomerLanguageId: language.CustomerLanguageId, AddedBy : language.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerLanguage', payload)
        .subscribe(data => {
                  this.languageList.splice(i, 1);
                  if (row.CustomerProfileId > 0) {
                    var langDetails = {};
                    langDetails = {
                      CustomerProfileId: row.CustomerProfileId,
                      CustomerLanguageId: row.CustomerLanguageId,
                      IsDeleted: true
                    }

                    var cloneObj = JSON.parse(JSON.stringify(langDetails));
                    this.deletedLanguageList.push(cloneObj);
                    this.deletedLanguageList = [...this.deletedLanguageList];
                    this.languageId=0;
                }
    });

}

  editAdditionalInformationData(row, i, additionalInformationId) {
    this.editAdditionalInformation = true;
    this.additionalInformationForm.patchValue({
      AdditionalInfo: row.AdditionalInfo,
    });
    this.additionalInformationId = additionalInformationId;
    this.editAdditionalInformation = true;
    this.currentAdditionalInformation = this.additionalInformationList[i];
    this.additionalInformationList.splice(i, 1);
  }

  deleteAdditionalInformationData(row, i) {
    if(row.CustomerAdditionalInformationId == null || row.CustomerAdditionalInformationId == undefined)
    {
     this.additionalInformationList.splice(i, 1);
     return;
    }
    let additionalInformation =  this.additionalInformationList[i];

    let payload = {CustomerProfileId: additionalInformation.CustomerProfileId, CustomerAdditionalInformationId: additionalInformation.CustomerAdditionalInformationId, AddedBy : additionalInformation.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerAdditionalInformation', payload)
        .subscribe(data => {
          this.additionalInformationList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var additionalInfoDetails = {};
            additionalInfoDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerAdditionalInformationId: row.CustomerAdditionalInformationId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(additionalInfoDetails));
            this.deletedAdditionalInformationList.push(cloneObj);
            this.deletedAdditionalInformationList = [...this.deletedAdditionalInformationList];
            this.additionalInformationId=0;
          }
    });
  }

}
