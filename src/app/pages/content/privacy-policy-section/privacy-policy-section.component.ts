import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '../../../service/api.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
  selector: 'app-privacy-policy-section',
  templateUrl: './privacy-policy-section.component.html',
  styleUrls: ['./privacy-policy-section.component.scss']
})
export class PrivacyPolicySectionComponent implements OnInit {
  Editor = ClassicEditor;
  PrivacyPolicySectionForm: FormGroup;
  iApplyUser;
  submitted: boolean = false;
  PrivacyPolicySectionId: any;
  PrivacyPolicyData;
  currentUserType;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private activatedRoute:ActivatedRoute) { }

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
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.currentUserType = this.iApplyUser.userType;
    this.activatedRoute.params.subscribe( params =>
      this.PrivacyPolicySectionId = params['id']
    )
    if (this.PrivacyPolicySectionId){
      this.getPrivacyPolicyById();
    } else {
      this.getPrivacyPolicyData();
    }
    this.PrivacyPolicySectionForm = this.formBuilder.group({
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }

  get cuf() { return this.PrivacyPolicySectionForm.controls; }

  getPrivacyPolicyData() {
    this.apiService.get('PrivacyPolicy').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.PrivacyPolicyData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }
  getPrivacyPolicyById() {
    this.apiService.get('PrivacyPolicy/'+this.PrivacyPolicySectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.PrivacyPolicyData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.PrivacyPolicySectionForm.patchValue({
      Title: this.PrivacyPolicyData.title,
      Description: this.PrivacyPolicyData.description,
      Comment: this.PrivacyPolicyData.comment
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updatePrivacyPolicySection(){
    this.submitted = true;
    if (this.PrivacyPolicySectionForm.valid){
      let payload = {
        Title: this.PrivacyPolicySectionForm.value.Title,
        Description: this.PrivacyPolicySectionForm.value.Description,
        Comment: this.PrivacyPolicySectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('PrivacyPolicy', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error);
        if(err.error){
          this.toastMsg.error('Privacy Policy Data error');
        }
      });
    }
  }

  approvePrivacyPolicySection(event){
    let payload = {
      PrivacyPolicyId: this.PrivacyPolicySectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('PrivacyPolicy/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Privacy Policy Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Privacy Policy Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Privacy Policy Section Data Approve error');
      }
    });
  }

}
