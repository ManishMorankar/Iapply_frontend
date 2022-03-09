import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { countryCodes } from '../../country-codes';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  EducationForm: FormGroup;
  submitted : boolean = false ;
  educationList: any = [];
  deletedEducationList: any = [];
  CustomerProfileId: any;
  CustomerEducationId: any = 0;

  IsCurrentlyEnrolled: boolean = false;
  currentUser;
  dropdownList: any;
  LinkedInProfile: any;
  ResumeProfile: any;
  eduList: any [];
  countryList: any[];
  completedStep: any = 0;
  iApplyUser;
  SubscriptionCancel: boolean = false;
  ToDate: any;
  resumeContext: any;
  PaymentInfo;
  hasChange: boolean = false;
  form: any;
  deleteSection:any;
  deleteItem:any;
  deleteId:any;
  pSubmitted:boolean = false;
  editEducation: boolean = false;
  currentEducation : any;
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

  deleteModal(item, index, sectionName){
    this.deleteItem = item;
    this.deleteId = index;
    this.deleteSection = sectionName;
    $('#deleteEducation').modal('show');
  }

  deleteItemFunc(){
    if(this.deleteSection == 'education'){
      this.deleteEducationDetailsData(this.deleteItem, this.deleteId);
    }
    $('#deleteEducation').modal('hide');
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

  onCreateGroupFormValueChange(){
    this.hasChange = this.getDirtyValues(this.EducationForm);
  }

  ngOnInit(): void {
    $(document).ready(function() {
      $("#City").keypress(function(e) {
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
    this.getDropDowns();
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.EducationForm = this.formBuilder.group({
      UniversityName: ['', [Validators.required]],
      FieldOfStudy: ['', [Validators.required]],
      EducationId: ['', [Validators.required]],
      CountryId: ['', Validators.required],
      City: ['', [Validators.pattern("^[a-zA-Z ]*$")]],
      CurrentlyEnrolled: [''],
      FromDate: ['', Validators.required],
      ToDate: ['']
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
      console.log(this.CustomerProfileId);
    });

    if (localStorage.getItem("LinkedInProfile")) {
      this.LinkedInProfile = JSON.parse(localStorage.getItem("LinkedInProfile"));
      this.addEducationFromLinkedInProfile();
    }
    else if (localStorage.getItem("ResumeProfile") && localStorage.getItem("EducationStatus")) {
      this.ResumeProfile = JSON.parse(localStorage.getItem("ResumeProfile"));
      if (this.ResumeProfile.degree.length > 0) {
        this.EducationForm.controls.FieldOfStudy.setValue(this.ResumeProfile.degree[0]);
      }
    }
    else
    {
      this.getEducationList();
    }


    if (localStorage.getItem("parsed-resume") != null) {
      this.ParseResume = JSON.parse(localStorage.getItem("parsed-resume"));
    }
  }
  formData(arg0: string, formData: any) {
    throw new Error('Method not implemented.');
  }
  get contactInfo(){
    return this.EducationForm.controls;
  }
  setFromStatus()
  {
    var selectedDate = new Date(this.EducationForm.controls.FromDate.value);
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.EducationForm.controls.FromDate.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }

    if(this.EducationForm.controls.FromDate.value == this.EducationForm.controls.ToDate.value)
      {
        this.EducationForm.controls.FromDate.reset();
        this.toastMsg.error("From date is not equal to To date");
      }

  }
  setStatus(){
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.EducationForm.controls.ToDate.value > today ) {
      this.EducationForm.controls.ToDate.reset();
      this.toastMsg.error("To date must be less than today date");
    }
    else if(this.EducationForm.controls.ToDate.value < this.EducationForm.controls.FromDate.value)
    {
      this.EducationForm.controls.ToDate.reset();
      this.toastMsg.error("To date must be less than From date");
    }
    else if(this.EducationForm.controls.ToDate.value == this.EducationForm.controls.FromDate.value)
    {
      this.EducationForm.controls.ToDate.reset();
      this.toastMsg.error("To date is not equal to  From date");
    }
    else
    {
    var selectedDate = new Date(this.EducationForm.controls.ToDate.value);
    let dateyear= selectedDate.getFullYear();
    if(dateyear.toString().length==4)
    {
     if((dateyear)*1 < 1900 ) {
      this.EducationForm.controls.ToDate.reset();
      this.toastMsg.error("Please Select valid Date");
     }
    }

    }
  }
  getEducationList() {
    this.apiService.get('CustomerProfile/EducationDetails/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        for (let index = 0; index < data.result.length; index++) {
          const edu = data.result[index];
          var eduDetails = {};
          eduDetails = {
            CustomerProfileId: edu.customerProfileId,
            CustomerEducationId: edu.customerEducationId,
            EducationId: edu.educationId,
            EducationName: edu.educationName,
            UniversityName: edu.universityName,
            CountryId: edu.countryId,
            CountryName: edu.countryName,
            FieldOfStudy:edu.fieldOfStudy,
            City: edu.city,
            CurrentlyEnrolled: edu.currentlyEnrolled,
            FromDate: edu.fromDate,
            ToDate: edu.toDate
          }
          this.CustomerProfileId = edu.customerProfileId;
          var cloneObj = JSON.parse(JSON.stringify(eduDetails));
          this.educationList.push(cloneObj);
          this.educationList = this.educationList.sort((a,b) =>{
            var keyA = new Date(a.FromDate),
                keyB = new Date(b.FromDate);
              // Compare the 2 dates
              if (keyA > keyB) return -1;
              if (keyA < keyB) return 1;
              return -1;
          });
          this.educationList = [...this.educationList];
        }
        if (this.completedStep <= 3 && this.ParseResume == null) {
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

  fillContentFromResume() {
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep > 3) {
      return;
    }

    if (localStorage.getItem("parsed-resume") != 'null') {
      this.resumeContext = JSON.parse(localStorage.getItem("parsed-resume"));
    }
    var educations;
    var fromDatabaseAsWell = false;

    try {
      if (this.educationList.length > 0) {
        fromDatabaseAsWell = true;
      }
      educations = this.resumeContext["Value"]["ResumeData"]["Education"]["EducationDetails"];

      for (let i = 0; i < educations.length; i++) {
        try {
          var educationDetails = {};
          var universityName = "", fieldOfStudy = "", countryId, levelOfEducation = "", city = "", fromDate;
          try {
            if (fromDatabaseAsWell) {
              universityName = educations[i]["SchoolName"]["Raw"] +  " [FROM RESUME]";
            } else {
              universityName = educations[i]["SchoolName"]["Raw"];
            }
           } catch (ex) { }
          try {
            fieldOfStudy = educations[i]["Majors"][0];
          } catch (ex) { }
          try {
            countryId = this.findCountryUsingCode(educations[i]["CountryCode"]);
          } catch (ex) { }
          try {
            // var countryCode = this.dropdownList.LevelEducation[i]["Location"]["CountryCode"];
            // countryId = this.getCountryByCode(countryCode);
          } catch (ex) { }
          try {
            city = educations[i]["Location"]["Municipality"];
          } catch (ex) { }
          try {
            var parts = educations[i]["LastEducationDate"]["Date"].split('T');
            fromDate = parts[0];
          } catch (ex) { }
          educationDetails = {
            CustomerProfileId: this.CustomerProfileId,
            UniversityName: universityName,
            FieldOfStudy: fieldOfStudy,
           // EducationId: levelOfEducation,
            CountryId: countryId,
            City: city,
            FromDate: fromDate,
            AddedBy: this.currentUser.customerId
          }
          var cloneObj = JSON.parse(JSON.stringify(educationDetails));
          this.educationList.push(cloneObj);
          this.educationList = [...this.educationList];
          this.EducationForm.reset();
          this.IsCurrentlyEnrolled = false;
        } catch (ex) { }
      }
    } catch (ex) { }
  }

  addEducationFromLinkedInProfile() {
    for (var i = 0; i < this.LinkedInProfile.education.length; i++) {
      var educationDetails = {};
      educationDetails = {
        CustomerProfileId: this.CustomerProfileId,
        UniversityName: this.LinkedInProfile.education[i].organization,
        FieldOfStudy: this.LinkedInProfile.education[i].fieldsOfStudy,
        EducationLevel: '',
        Country: '',
        City: '',
        CurrentlyEnrolled: '',
        FromDate: this.LinkedInProfile.education[i].startMonthYear,
        ToDate: this.LinkedInProfile.education[i].endMonthYear,
        AddedBy: this.currentUser.customerId,
      }
      var cloneObj = JSON.parse(JSON.stringify(educationDetails));
      this.educationList.push(cloneObj);
      this.educationList = [...this.educationList];
      this.EducationForm.reset();
    }
  }

  onBack() {
    localStorage.setItem('current-step', "3");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 3) {
      localStorage.setItem('completed-steps', "3");
    }
    this.router.navigate(['customer/experience'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
  }

  onNext(command){
    this.submitted = true;
    console.log(this.EducationForm.value);

    if (this.educationList.length == 0) {
      this.toastMsg.error('Please add education details.');
      return;
    }

    // validate the experience details before saving
    for (let index = 0; index < this.educationList.length; index++) {
      const edu = this.educationList[index];
      if (edu.UniversityName == undefined || edu.UniversityName == '') {
        var counter = index + 1;
        this.toastMsg.error('Unversity name is missing for ' + counter + ' education.');
        return;
      }
      if (edu.FieldOfStudy == undefined || edu.FieldOfStudy == '') {
        var counter = index + 1;
        this.toastMsg.error('Field of study is missing for ' + edu.UniversityName + "  education.");
        return;
      }
      if (edu.CountryId == undefined || edu.CountryId == '') {
        var counter = index + 1;
        this.toastMsg.error('Country is missing for ' + edu.UniversityName + "  education.");
        return;
      }
      if (edu.EducationId == undefined || edu.EducationId == '') {
        var counter = index + 1;
        this.toastMsg.error('Education Level is missing for ' + edu.UniversityName + "  education.");
        return;
      }
      if (edu.FromDate == undefined || edu.FromDate == '') {
        var counter = index + 1;
        this.toastMsg.error('From Date is missing for ' + edu.UniversityName + "  education.");
        return;
      }
      if (edu.CurrentlyEnrolled == false && (edu.ToDate == undefined || edu.ToDate == '')) {
        var counter = index + 1;
        this.toastMsg.error('To Date is missing for ' + edu.UniversityName + "  education.");
        return;
      }
    }

    let educationpayload = {};
    educationpayload = { CustomerProfileId: this.CustomerProfileId, CustomerEducation: this.educationList, DeletedCustomerEducation: this.deletedEducationList };
    this.apiService.post('CustomerProfile/EducationDetails', educationpayload)
        .subscribe(data => {

        if (data.statusCode === "201" && data.result) {
          var CustomerProfileId=data.result.customerProfileId;
          this.toastMsg.success('Education details saved successfully.');
          if (localStorage.getItem("EducationStatus")) {
            localStorage.removeItem("EducationStatus");
          }
          localStorage.setItem('current-step', "5");
          this.completedStep = localStorage.getItem('completed-steps');
          if (this.completedStep < 5) {
            localStorage.setItem('completed-steps', "4");
          }
          if (command == "Continue") {
            this.router.navigate(['customer/other-details'], { queryParams: { CustomerProfileId: CustomerProfileId } });
          } else {
            this.educationList = [];
            this.getEducationList();
          }
        } else {
          this.toastMsg.error('Failed to save education details.');
        }
      });
  }

  toggleToDate(event) {
    if (event.target.checked) {
      this.IsCurrentlyEnrolled = true;
      this.ToDate = new Date();
      this.EducationForm.controls.ToDate.reset();
    }
    else {
      this.IsCurrentlyEnrolled = false;
      this.ToDate = this.EducationForm.controls.ToDate.value;
    }
  }

  resetEducation(){
    let education = this.currentEducation;
    let educationDetails = {
      CustomerProfileId: this.CustomerProfileId,
      UniversityName: this.EducationForm.controls.UniversityName.value,
      FieldOfStudy: this.EducationForm.controls.FieldOfStudy.value,
      EducationId: this.EducationForm.controls.EducationId.value,
      CountryId: this.EducationForm.controls.CountryId.value,
      City: this.EducationForm.controls.City.value,
      CurrentlyEnrolled: this.EducationForm.controls.CurrentlyEnrolled.value,
      FromDate: this.EducationForm.controls.FromDate.value,
      ToDate: this.EducationForm.controls.ToDate.value,
      AddedBy: this.currentUser.customerId,
      CustomerEducationId: this.CustomerEducationId
    }

    var cloneObj = JSON.parse(JSON.stringify(educationDetails));
    this.educationList.push(cloneObj);
    this.educationList = [...this.educationList];
    this.EducationForm.reset();
    this.CustomerEducationId=0;
    this.IsCurrentlyEnrolled = false;

    this.editEducation = false;

  }

  addEducation(){
    // let educationDetails = {};
    let educationDetails = {
      CustomerProfileId: this.CustomerProfileId,
      UniversityName: this.EducationForm.controls.UniversityName.value,
      FieldOfStudy: this.EducationForm.controls.FieldOfStudy.value,
      EducationId: this.EducationForm.controls.EducationId.value,
      CountryId: this.EducationForm.controls.CountryId.value,
      City: this.EducationForm.controls.City.value,
      CurrentlyEnrolled: this.EducationForm.controls.CurrentlyEnrolled.value,
      FromDate: this.EducationForm.controls.FromDate.value,
      ToDate: this.EducationForm.controls.ToDate.value,
      AddedBy: this.currentUser.customerId,
      CustomerEducationId: this.CustomerEducationId
    }

    if (educationDetails.UniversityName == undefined || educationDetails.UniversityName == '') {
      this.toastMsg.error('Unversity name is missing for education.');
      return;
    }
    if (educationDetails.FieldOfStudy == undefined || educationDetails.FieldOfStudy == '') {
      this.toastMsg.error('Field of study is missing for ' + educationDetails.UniversityName + "  education.");
      return;
    }
    if (educationDetails.CountryId == undefined || educationDetails.CountryId == '') {
      this.toastMsg.error('Country is missing for ' + educationDetails.UniversityName + "  education.");
      return;
    }
    if (educationDetails.EducationId == undefined || educationDetails.EducationId == '') {
      this.toastMsg.error('Education Level is missing for ' + educationDetails.UniversityName + "  education.");
      return;
    }
    if (educationDetails.FromDate == undefined || educationDetails.FromDate == '') {
      this.toastMsg.error('From Date is missing for ' + educationDetails.UniversityName + "  education.");
      return;
    }
    if (educationDetails.CurrentlyEnrolled == false && (educationDetails.ToDate == undefined || educationDetails.ToDate == '')) {
      this.toastMsg.error('To Date is missing for ' + educationDetails.UniversityName + "  education.");
      return;
    }

    this.apiService.post('CustomerProfile/AddUpdateCustomerEducationDetails', educationDetails)
    .subscribe(data => {
        if(!this.CustomerEducationId){
          educationDetails.CustomerEducationId = parseInt(data.result)
        }
        var cloneObj = JSON.parse(JSON.stringify(educationDetails));
        this.educationList.push(cloneObj);
        this.educationList = this.educationList.sort((a,b) =>{
          var keyA = new Date(a.FromDate),
              keyB = new Date(b.FromDate);
            // Compare the 2 dates
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return -1;
        });
        this.educationList = [...this.educationList];
        this.EducationForm.reset();
        this.CustomerEducationId=0;
        this.IsCurrentlyEnrolled = false;
        this.currentEducation = undefined;
    });
    this.editEducation = false;

  }



  getDropDowns(){
    this.apiService.get('CustomerProfile/dropdowns')
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.dropdownList = data.result
        this.eduList = data.result.LevelEducation;
        this.countryList = data.result.Country;
      }
    })
  }
  findCountry(CountryId: number){
    var filter_array = this.dropdownList.Country.filter(x => x.id == CountryId);
    if (filter_array.length > 0) {
      return filter_array[0].name;
    }
  }
  getCountryByCode(countryCode: number) {
    var filter_array = this.dropdownList.Country.filter(x => x.name == countryCode);
    if (filter_array.length > 0) {
      return filter_array[0].id;
    }
  }
  findEducation(EducationId: number)
  {
    var filter_array = this.dropdownList.LevelEducation.filter(x => x.id == EducationId);
    if (filter_array.length > 0) {
      return filter_array[0].name;
    }
  }
  editEducationDetailsData(row, i, experience_id) {
    this.EducationForm.patchValue({
      UniversityName: row.UniversityName,
      FieldOfStudy: row.FieldOfStudy,
      EducationId: row.EducationId,
      CountryId: row.CountryId,
      City: row.City,
      CurrentlyEnrolled: row.CurrentlyEnrolled,
      FromDate: row.FromDate,
      ToDate: row.ToDate,

    });
    this.CustomerEducationId = experience_id;
    this.editEducation = true;
    this.CustomerEducationId = row.CustomerEducationId;
    this.currentEducation = this.educationList[i];
    this.educationList.splice(i, 1);
  }

  deleteEducationDetailsData(row, i){

    if(row.CustomerEducationId == null || row.CustomerEducationId == undefined)
    {
     this.educationList.splice(i, 1);
     return;
    }

    let education =  this.educationList[i];
    let payload = {CustomerProfileId: education.CustomerProfileId, CustomerEducationId: education.CustomerEducationId, AddedBy : education.AddedBy};
     this.apiService.post('CustomerProfile/DeleteCustomerEducationDetails', payload)
        .subscribe(data => {
          this.educationList.splice(i, 1);
          if (row.CustomerProfileId > 0) {
            var eduDetails = {};
            eduDetails = {
              CustomerProfileId: row.CustomerProfileId,
              CustomerEducationId: row.CustomerEducationId,
              IsDeleted: true
            }

            var cloneObj = JSON.parse(JSON.stringify(eduDetails));
            this.deletedEducationList.push(cloneObj);
            this.deletedEducationList = [...this.deletedEducationList];
            this.CustomerEducationId=0;
          }
        });
  }

}
