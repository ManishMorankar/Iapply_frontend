import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-terms-and-conditions-section',
  templateUrl: './terms-and-conditions-section.component.html',
  styleUrls: ['./terms-and-conditions-section.component.scss']
})
export class TermsAndConditionsSectionComponent implements OnInit {

  Editor = ClassicEditor;
  iApplyUser: any;
  TermsAndConditionsSectionId: any;
  TermsAndConditionsSectionForm: FormGroup;
  TermsAndConditionsData: any;
  submitted = false;
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
      this.TermsAndConditionsSectionId = params['id']
    )
    if (this.TermsAndConditionsSectionId){
      this.getTermsAndConditionsSectionById();
    } else {
      this.getTermsAndConditionsSectionData();
    }
    this.TermsAndConditionsSectionForm = this.formBuilder.group({
      HtmlContent: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.TermsAndConditionsSectionForm.controls; }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }

  getTermsAndConditionsSectionData() {
    this.apiService.get('TermsConditions').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.TermsAndConditionsData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getTermsAndConditionsSectionById() {
    this.apiService.get('TermsConditions/'+this.TermsAndConditionsSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.TermsAndConditionsData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.TermsAndConditionsSectionForm.patchValue({
      HtmlContent: this.TermsAndConditionsData.htmlContent,
      Comment: this.TermsAndConditionsData.comment
    });
  }

  updateTermsAndConditionsSection() {
    this.submitted = true;
    if (this.TermsAndConditionsSectionForm.valid){
      let payload = {
        HtmlContent: this.TermsAndConditionsSectionForm.value.HtmlContent,
        Comment: this.TermsAndConditionsSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('TermsConditions', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Terms And Conditions Section Data error');
        }
      });
    }
  }

  approveTermsAndConditionsSection(event){
    let payload = {
      TermsConditionsId: this.TermsAndConditionsSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('TermsConditions/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Terms And Conditions Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Terms And Conditions Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Terms And Conditions Section Data Approve error');
      }
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
