import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs-compat';
import { ComponentCanDeactivate } from '../../../pending-changes.guard';
import * as moment from 'moment';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit, ComponentCanDeactivate {

  personalProfileForm: FormGroup;
  contactInformationForm: FormGroup;

  currentUser;
  noImg;
  ProfilePicture: SafeResourceUrl;
  removeImageButton;
  DisabilityOption="No"
  isDisabilityYes: boolean = false;
  submitted = false;
  formData;
  CustomerProfileId: any = 0;
  dropdownList: any;
  ProfileStrength = "20%";
  linkedInCode: string = '';
  linkedInProfile: any;
  personalProfile: any;
  nationalityList: any [];
  countryList: any[];
  ResumeProfile: any;
  base64TrimmedURL: string;
  base64DefaultURL: string;
  othernationality: any;
  completedStep: any = 0;
  iApplyUser;
  SubscriptionCancel: boolean = false;
  resumeContext: any;
  PaymentInfo;
  hasChange: boolean = false;
  form: any;
  initialValue: any;
  ParseResume:any;
  MiddleName: string;
  VisaStatus: any;
  PostalCode: string;
  Disability: string;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg:ToastrService, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) {
  }


  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
   // console.log(this.submitted);
    if(this.submitted){
      return true;
    }
    this.onCreateGroupFormValueChange();
    return !this.hasChange;
  }

  ngOnInit(): void {
    $(document).ready(function() {
      $("#FirstName").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
          this.toastMsg.error("You Have Reach the Input Limit of Characters");
        }
      });
      $("#MiddleName").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
          this.toastMsg.error("You Have Reach the Input Limit of Characters");
        }
      });

      $("#LastName").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
          this.toastMsg.error("You Have Reach the Input Limit of Characters");
        }
      });

      $("#City").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
          this.toastMsg.error("You Have Reach the Input Limit of Characters");
        }
      });

      $("#PostalCode").keypress(function(e) {
        var length = this.value.length;
        if (length >= 45) {
          e.preventDefault();
          alert("You Have Reach the Input Limit of Characters");
          this.toastMsg.error("You Have Reach the Input Limit of Characters");
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
      if (this.PaymentInfo.subscriptionStatus=="Cancel") {
        this.SubscriptionCancel = true;
      }
    }
    $('.phone-control').each(function(){

      var input = this;
      window['intlTelInput'](input, {
        // allowDropdown: false,
        autoHideDialCode: true,
        // autoPlaceholder: "off",
        // dropdownContainer: document.body,
        // excludeCountries: ["us"],
         formatOnDisplay: false,
        // geoIpLookup: function(callback) {
        //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
        //     var countryCode = (resp && resp.country) ? resp.country : "";
        //     callback(countryCode);
        //   });
        // },
        // hiddenInput: "full_number",
          initialCountry: "auto",
        // localizedCountries: { 'de': 'Deutschland' },
         nationalMode: true,
        // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
        // placeholderNumberType: "MOBILE",
        // preferredCountries: ['cn', 'jp'],
        // separateDialCode: true,
        utilsScript: "../assets/js/utils.js",
      });
    });




    this.getDropDowns();
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.personalProfileForm = this.formBuilder.group({
      FirstName: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      MiddleName:[''],
      LastName:['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      BirthDate:['', Validators.required],
      NationalityId:['', Validators.required],
      OtherNationalityId: [''],
      VisaStatus: [''],
      Gender: ['', Validators.required],
      Disability: [''],
    });

    this.contactInformationForm = this.formBuilder.group({
      PrimaryEmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      SecondaryEmailId:['',  Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      PrimaryPhoneNumber:['', [Validators.required, Validators.pattern("^[- +()0-9]{10,15}$")]],
      SecondaryPhoneNumber:['',[ Validators.pattern("^[- +()0-9]{10,15}$")]],
      Address:['',Validators.required],
      CountryId: ['', Validators.required],
      City: ['',[Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      PostalCode: ['']
    });

    if (localStorage.getItem("parsed-resume") != null) {
      this.ParseResume = JSON.parse(localStorage.getItem("parsed-resume"));
    }
         // Resume  Parser GET API
 if (this.completedStep <= 2 && this.ParseResume == null) {
  // call API and get stored resume from database
  this.apiService.get('CustomerProfile/GetResumeContent/'+ this.currentUser.customerId )
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
 else
 {
  this.fillContentFromResume();
}
//MAX Length Provide



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

    this.hasChange = this.getDirtyValues(this.personalProfileForm);
    if(this.hasChange){
      return null;
    }
    this.hasChange = this.getDirtyValues(this.contactInformationForm);
  }

  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
        .subscribe(data => {
          if (data.statusCode === '201' && data.result) {
            this.personalProfile = data.result
            if (this.personalProfile.firstName == null || this.personalProfile.firstName == '') {
              return;
            }
            this.ProfilePicture = this.personalProfile.imageResult
            this.personalProfileForm.controls.FirstName.setValue(this.personalProfile.firstName);
            if (this.personalProfile.middleName == null) {
              this.personalProfile.middleName = "";
            }
            if (this.personalProfile.visaStatus == null) {
              this.personalProfile.visaStatus = "";
            }
            if (this.personalProfile.secondaryPhoneNumber == null) {
              this.personalProfile.secondaryPhoneNumber = "";
            }
            if (this.personalProfile.secondaryEmailId == null) {
              this.personalProfile.secondaryEmailId = "";
            }
            if (this.personalProfile.address == null) {
              this.personalProfile.address = "";
            }
            if (this.personalProfile.postalCode == null) {
              this.personalProfile.postalCode = "";
            }
            if (this.personalProfile.city == null) {
              this.personalProfile.city = "";
            }

            this.personalProfileForm.controls.MiddleName.setValue(this.personalProfile.middleName);
            this.personalProfileForm.controls.LastName.setValue(this.personalProfile.lastName);
            this.personalProfileForm.controls.BirthDate.setValue(this.personalProfile.birthDate);
            this.personalProfileForm.controls.OtherNationalityId.setValue(this.personalProfile.otherNationalityId);
            this.personalProfileForm.controls.Gender.setValue(this.personalProfile.gender);
            this.personalProfileForm.controls.NationalityId.setValue(this.personalProfile.nationalityId);
            this.personalProfileForm.controls.VisaStatus.setValue(this.personalProfile.visaStatus);
            this.personalProfileForm.controls.Disability.setValue(this.personalProfile.disability);

            this.contactInformationForm.controls.PrimaryEmailId.setValue(this.personalProfile.primaryEmailId);
            this.contactInformationForm.controls.SecondaryEmailId.setValue(this.personalProfile.secondaryEmailId);
            this.contactInformationForm.controls.PrimaryPhoneNumber.setValue(this.personalProfile.primaryPhoneNumber);
            this.contactInformationForm.controls.SecondaryPhoneNumber.setValue(this.personalProfile.secondaryPhoneNumber);
            this.contactInformationForm.controls.City.setValue(this.personalProfile.city);
            this.contactInformationForm.controls.CountryId.setValue(this.personalProfile.countryId);
            this.contactInformationForm.controls.PostalCode.setValue(this.personalProfile.postalCode);
            this.contactInformationForm.controls.Address.setValue(this.personalProfile.address);
            this.CustomerProfileId = this.personalProfile.customerProfileId;
            this.initialValue = this.personalProfileForm.value
            $('.phone-control').each(function(){

              var input = this;
              window['intlTelInput'](input, {
                // allowDropdown: false,
                autoHideDialCode: true,
                // autoPlaceholder: "off",
                // dropdownContainer: document.body,
                // excludeCountries: ["us"],
                 formatOnDisplay: false,
                // geoIpLookup: function(callback) {
                //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                //     var countryCode = (resp && resp.country) ? resp.country : "";
                //     callback(countryCode);
                //   });
                // },
                // hiddenInput: "full_number",
                  initialCountry: "auto",
                // localizedCountries: { 'de': 'Deutschland' },
                 nationalMode: true,
                // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
                // placeholderNumberType: "MOBILE",
                // preferredCountries: ['cn', 'jp'],
                // separateDialCode: true,
                utilsScript: "../assets/js/utils.js",
              });
            });

          } else {
            this.toastMsg.error(data.result);
          }
        })
  }
  getCustomerProfileId() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.personalProfile = data.result
          if (this.personalProfile.firstName == null || this.personalProfile.firstName == '') {
            this.CustomerProfileId = 0;
            return;
          }
          this.CustomerProfileId = this.personalProfile.customerProfileId;

        } else {
          this.toastMsg.error(data.result);
        }
      })
  }

  getLinkedInProfileData() {
    this.apiService.get('CustomerProfile/LinkedInProfile/' + this.linkedInCode)
      .subscribe(data => {
        if (data.statusCode === '201' && data.result) {
          this.linkedInProfile = data.result
          this.personalProfileForm.controls.FirstName.setValue(this.linkedInProfile.firstName);
          this.personalProfileForm.controls.LastName.setValue(this.linkedInProfile.lastName);
          this.personalProfileForm.controls.BirthDate.setValue(this.linkedInProfile.birthDate);
          localStorage.setItem('LinkedInProfile', JSON.stringify(data.result));
        }
      })
  }

  // Fill content from resume only when it is first time
  fillContentFromResume() {
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep >= 2) {
      return;
    }
    if (localStorage.getItem("parsed-resume") != 'null') {
      this.resumeContext = JSON.parse(localStorage.getItem("parsed-resume"));
    }

    try {
      this.personalProfileForm.controls.FirstName.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["CandidateName"]["GivenName"]);

    } catch (e) { };
    try {
      this.personalProfileForm.controls.MiddleName.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["CandidateName"]["MiddleName"]);
    } catch (e) { };
    try {
      this.personalProfileForm.controls.LastName.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["CandidateName"]["FamilyName"]);
    } catch (e) { };
    try {
      this.personalProfileForm.controls.BirthDate.setValue(this.resumeContext["Value"]["ResumeData"]["PersonalAttributes"]["DateOfBirth"]["Date"]);
    } catch (e) { }
    try {
      this.personalProfileForm.controls.VisaStatus.setValue(this.resumeContext["Value"]["ResumeData"]["PersonalAttributes"]["VisaStatus"]);
    } catch (e) { }
    try {
      this.contactInformationForm.controls.City.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["Location"]["Municipality"]);
    } catch (e) { }

    try {
      this.contactInformationForm.controls.Address.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["Location"]["StreetAddressLines"][0]);
    } catch (e) { }
    try {
      this.personalProfileForm.controls.Gender.setValue(this.resumeContext["Value"]["ResumeData"]["PersonalAttributes"]["Gender"]);
    } catch (e) { }

    try {
      var numbers = this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["Telephones"];
      if (numbers.length > 0) {
        this.contactInformationForm.controls.PrimaryPhoneNumber.setValue(numbers[0]["Raw"]);
        if (numbers.length > 1) {
          this.contactInformationForm.controls.SecondaryPhoneNumber.setValue(numbers[1]["Raw"]);
        }
      }
    } catch (e) { }

    try {
      this.contactInformationForm.controls.PrimaryEmailId.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["EmailAddresses"])
    } catch (e) { };
    try {
      this.contactInformationForm.controls.PostalCode.setValue(this.resumeContext["Value"]["ResumeData"]["ContactInformation"]["Location"]["PostalCode"]);
    } catch (e) { };

    //this.contactInformationForm.controls.City.setValue(this.personalProfile.city);
    //this.personalProfileForm.controls.OtherNationalityId.setValue(this.personalProfile.otherNationalityId);
    //this.personalProfileForm.controls.Gender.setValue(this.personalProfile.gender);
    //this.personalProfileForm.controls.NationalityId.setValue(this.personalProfile.nationalityId);
    //this.personalProfileForm.controls.VisaStatus.setValue(this.personalProfile.visaStatus);
    //this.contactInformationForm.controls.SecondaryEmailId.setValue(this.personalProfile.secondaryEmailId);
    //this.contactInformationForm.controls.CountryId.setValue(this.personalProfile.countryId);
    //this.contactInformationForm.controls.Address.setValue("");
  }

  getDropDowns(){
    this.apiService.get('CustomerProfile/dropdowns')
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.dropdownList = data.result
        this.nationalityList = data.result.Nationality;
        this.countryList = data.result.Country;

        this.linkedInCode = this.activatedRoute.snapshot.queryParamMap.get("code");
        if (this.linkedInCode != null) {
          this.getLinkedInProfileData();
          this.getCustomerProfileId();
        }
        else {
          if (localStorage.getItem("LinkedInProfile")) {
            localStorage.removeItem("LinkedInProfile");
          }

          if (this.currentUser.customerId != undefined && this.currentUser.customerId > 0) {
            this.getPersonalProfile();
          }
          // extract content from resume

          // if (localStorage.getItem("ResumeProfile") && localStorage.getItem("PersonalProfileStatus")) {
          //   this.getCustomerProfileId();
          //   this.ResumeProfile = JSON.parse(localStorage.getItem("ResumeProfile"));
          //   var name = this.ResumeProfile.name.split(' ');
          //   if (name.length >= 2) {
          //     this.personalProfileForm.controls.FirstName.setValue(name[0]);
          //     this.personalProfileForm.controls.LastName.setValue(name[1]);
          //   }
          //   else {
          //     this.personalProfileForm.controls.FirstName.setValue(this.ResumeProfile.name);
          //   }
          //   this.contactInformationForm.controls.PrimaryEmailId.setValue(this.ResumeProfile.email);
          //   this.contactInformationForm.controls.PrimaryPhoneNumber.setValue(this.ResumeProfile.phone);
          // }
          // else {
          //   if (this.currentUser.customerId != undefined && this.currentUser.customerId > 0) {
          //     this.getPersonalProfile();
          //   }
          // }
        }


      }
    })
  }

  setStatus() {
    var today = new Date();
    var birthDate = new Date(this.personalProfileForm.controls.BirthDate.value);
    var age = today.getFullYear() - birthDate.getFullYear();
    if (age <= 15) {
      this.personalProfileForm.controls.BirthDate.reset();
      this.toastMsg.error("Date of birth should be greater than today by 15 years or more.");
    }

  }

  onFileChange(event) {
    console.log(event.target.files[0]);
    // 2 MB = 2097152 bytes
    //250KB = 250000 bytes
    if (event.target.files[0].size < 250000) {
      this.ProfilePicture = <File> event.target.files[0];
      console.log(this.ProfilePicture);
    } else {
      this.toastMsg.error("Image size should be under 250kb")
      event.target.value = null;
    }
  }

  getProfileImage() {
    if (this.ProfilePicture == null || this.ProfilePicture == undefined || this.ProfilePicture == '') {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
        return this.noImg;
    }
    else {
      let imageUrl; //rename imageFileBinary to imageUrl
      let imageBinary = this.ProfilePicture; //image binary data response from api
      imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
      return imageUrl;
    }
  }

  removeFile() {
    this.ProfilePicture = "";
  }
//Base 64 Image Converted into Image


//End Image Decode
  get personalInfo(){
    return this.personalProfileForm.controls;
  }

  get contactInfo(){
    return this.contactInformationForm.controls;
  }

  toggleDisabilityDetails(event){
    if(event.target.checked){
      this.DisabilityOption="yes";
      this.isDisabilityYes = true;
    }
    else{
      this.DisabilityOption="no";
      this.isDisabilityYes = false;
    }
  }
  handleChange()
  {
  var FirstName=this.personalProfileForm.value.FirstName
    if (FirstName > 45)
    {
      this.toastMsg.error('you have reached a limit of length input');
    }
  }
  onBack(){
    this.router.navigate(['customer/MyProfile']);
  }

  onNext(command) {
    this.submitted = true;
    console.log('form Submitted', this.submitted);
    var nationality=this.personalProfileForm.value.OtherNationalityId;
    if(nationality == ""){
      this.othernationality="0"
    }
    else{
      this.othernationality=this.personalProfileForm.value.OtherNationalityId;
    }

    var middle=this.personalProfileForm.value.MiddleName;
    if(middle == "" || middle == undefined || middle== null){
      this.MiddleName= " ";
    }
    else{
      this.MiddleName=this.personalProfileForm.value.MiddleName;
    }

    var Visa=this.personalProfileForm.value.VisaStatus;
    if(Visa == "" || Visa == undefined || Visa== null){
      this.VisaStatus= " ";
    }
    else{
      this.VisaStatus=this.personalProfileForm.value.VisaStatus;
    }

    var Postal=this.contactInformationForm.value.PostalCode;
    if(Postal == "" || Postal == undefined || Postal== null){
       this.PostalCode= " ";
       }
    else{
      this.PostalCode=this.contactInformationForm.value.PostalCode;
     }

     var Disability=this.personalProfileForm.value.Disability;
     if(Disability == "" || Disability == undefined || Disability== "null" || Disability == null){
        this.Disability= " ";
        }
     else{
       this.Disability=this.personalProfileForm.value.Disability;;
      }


    console.log(this.personalProfileForm.value);
    console.log(this.contactInformationForm.value);
    this.formData = new FormData();
    if (this.personalProfileForm.invalid || this.contactInformationForm.invalid) {
      this.toastMsg.error('Please fill all mandatory  fields');
      // return;
    }
    if ((this.personalProfileForm.valid) && (this.contactInformationForm.valid)) {
      // if (!this.customerProfileId) {
        this.formData.append('FirstName', this.personalProfileForm.value.FirstName);
        this.formData.append('MiddleName',this.MiddleName);
        this.formData.append('LastName', this.personalProfileForm.value.LastName);
        this.formData.append('BirthDate', this.personalProfileForm.value.BirthDate);
        this.formData.append('NationalityId', this.personalProfileForm.value.NationalityId);
        this.formData.append('OtherNationalityId', this.othernationality);
        this.formData.append('ProfilePicture', this.ProfilePicture);
        this.formData.append('VisaStatus', this.VisaStatus);
        this.formData.append('Gender', this.personalProfileForm.value.Gender);
        this.formData.append('Disability',this.Disability);

        this.formData.append('PrimaryEmailId', this.contactInformationForm.value.PrimaryEmailId);
        this.formData.append('SecondaryEmailId', this.contactInformationForm.value.SecondaryEmailId);
        this.formData.append('PrimaryPhoneNumber', this.contactInformationForm.value.PrimaryPhoneNumber);
        this.formData.append('SecondaryPhoneNumber', this.contactInformationForm.value.SecondaryPhoneNumber);
        this.formData.append('Address', this.contactInformationForm.value.Address);
        this.formData.append('CountryId', this.contactInformationForm.value.CountryId);
        this.formData.append('City', this.contactInformationForm.value.City);
        this.formData.append('ProfileStrength', this.ProfileStrength);
        this.formData.append('PostalCode',this.PostalCode);
        this.formData.append('AddedBy', this.currentUser.customerId);
        this.formData.append('CustomerProfileId', this.CustomerProfileId);

        this.apiService.post('CustomerProfile', this.formData)
          .subscribe(data => {
            if (data.statusCode === "201" && data.result) {
              var CustomerProfileId = data.result.customerProfileId;
              this.toastMsg.success('Personal Information saved successfully');
              if (localStorage.getItem("PersonalProfileStatus")) {
                localStorage.removeItem("PersonalProfileStatus");
              }
              if (command == "Continue") {
               var Profile_Pic = $('.fileinput-preview.thumbnail').html();
                $('.avatar.rounded-circle').html(Profile_Pic);
               // alert(Profile_Pic);

                this.router.navigate(['customer/experience'], { queryParams: { CustomerProfileId: CustomerProfileId } });
              }
              localStorage.setItem('current-step', "3");
              this.completedStep = localStorage.getItem('completed-steps');
              if (this.completedStep < 3) {
                localStorage.setItem('completed-steps', "2");
              }
            }
          }, err => {
            if (err.statusCode == 400)
            this.toastMsg.error('Failed saved personal info, ' + err.error);
          });

  // }
  }
}

  onCancel(){
    this.router.navigate(['customer/my-profile']);
  }

}
