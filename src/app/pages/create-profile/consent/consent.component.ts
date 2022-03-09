import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent implements OnInit {
  Consent: any;
  TermsCondition: any;
  DataProtection: any;
  termsAndConditionsData: any;
  privacyPolicyData: any;
  termsConditionId;
  privacyPolicyId;
  consentForm: FormGroup;
  CustomerProfileId: any;
  currentUser;
  consentData;
  //TermsCondition;
  isConsentChecked="No";
  isTermsConditionChecked="No";
  isDataProtectionChecked="No";
  myModel = false;
  termsConditionModel = false;
  dataProtectionModel = false;
  completedStep: any = 0;
  iApplyUser;
  hasChange: boolean = false;
  form: any;
  submitted: boolean = false;

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

  onCreateGroupFormValueChange(){
    this.hasChange = this.getDirtyValues(this.consentForm);
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
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.getConsentDetails();
    this.getTermsAndCondtionsData();
    this.getPrivacyPolicyData();
    this.consentData="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";

    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));

    this.consentForm = this.formBuilder.group({
      Consent: [''],
      TermsCondition: [''],
      DataProtection: ['']
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
      // console.log(this.CustomerProfileId);
    });
  }

  toggleChecboxValue(event){
    if(event.target.checked){
      this.isConsentChecked="Yes";
      this.myModel = true;

    }
    else{
      this.isConsentChecked="No";
      this.myModel = false;
    }
  }
  toggleTermsCondition(event){
    if(event.target.checked){
      this.isTermsConditionChecked="Yes";
      this.termsConditionModel = true;

    }
    else{
      this.isTermsConditionChecked="No";
      this.termsConditionModel = false;
    }
  }
  toggleDataProtectione(event){
    if(event.target.checked){
      this.isDataProtectionChecked="Yes";
      this.dataProtectionModel = true;
    }
    else{
      this.isDataProtectionChecked="No";
      this.dataProtectionModel = false;
    }
  }

  getConsentDetails() {
    this.apiService.get('CustomerProfile/Consent/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data.statusCode === '201' && data.result){
        console.log(data.result);
        if(data.result.length !=0){
          this.myModel = true;
          this.termsConditionModel = true;
          this.dataProtectionModel = true;
        }
      }
    })
  }
  getTermsAndCondtionsData() {
    this.apiService.get('TermsConditions/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.termsAndConditionsData = res.result[0];
        this.termsConditionId = res.result[0].termsConditionsId
      }
    }, err => {

    });
  }
  getPrivacyPolicyData() {
    this.apiService.get('PrivacyPolicy/Approved').subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.privacyPolicyData = res.result[0];
        this.privacyPolicyId = res.result[0].privacyPolicyId
      }
    }, err => {

    });
  }


  onSubmit(){
    this.submitted = true;
    console.log(this.consentForm.value);
    if( this.myModel== false || this.termsConditionModel==false || this.dataProtectionModel==false){
      this.toastMsg.error("Please select all check boxes")
    }
    else{
      let payload = {};
    payload = {
      CustomerProfileId: this.CustomerProfileId,
      Consent: this.consentData,
      TermsCondition: this.isTermsConditionChecked,
      TermsConditionId: this.termsConditionId,
      PrivacyPolicyId: this.privacyPolicyId,
      AddedBy: this.currentUser.customerId
    };
    this.apiService.post('CustomerProfile/Consent', payload)
        .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          var CustomerProfileId=data.result.customerProfileId;
          this.toastMsg.success('Your profile has been saved successfully.');
          localStorage.setItem('current-step', "10");
          this.completedStep = localStorage.getItem('completed-steps');
          if (this.completedStep < 10) {
            localStorage.setItem('completed-steps', "9");
          }
          $('#SelectPlanCont').modal('show');
          $('.payment_wrpr').addClass('hide');
          $('.package_cont').removeClass('hide');
      //   this.router.navigate(['customer/selectPlan']);
        }
      });
    }
  }


}
