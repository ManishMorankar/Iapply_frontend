import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class FeaturesSectionComponent implements OnInit {

  Editor = ClassicEditor;
  iApplyUser;
  submitted = false;
  FeaturesSectionForm: FormGroup;
  FeaturesSectionId: any;
  FeaturesSectionData;
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
      this.FeaturesSectionId = params['id']
    )
    if (this.FeaturesSectionId){
      this.getFeaturesSectionById();
    } else {
      this.getFeaturesSection();
    }
    this.FeaturesSectionForm = this.formBuilder.group({
      Title: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      SubTitle: ['', Validators.required],
      Comment: ['', Validators.required],
      FeaturesContent: this.formBuilder.array([]),
    });
  }

  get fsf() {
    return this.FeaturesSectionForm.controls;
  }

  get FeaturesContent() : FormArray {
    return this.FeaturesSectionForm.get("FeaturesContent") as FormArray
  }

  newFeaturesContent(value): FormGroup {
    return this.formBuilder.group({
      HtmlContent: [value, Validators.required],
    });
  }

  addFeatureContent(value) {
    this.FeaturesContent.push(this.newFeaturesContent(value));
  }

  removeFeatureContent(i:number) {
    if (this.FeaturesContent.controls.length > 1){
      this.FeaturesContent.removeAt(i);
    } else {
      this.toastMsg.error('Minimum 1 field is required');
    }
  }

  getFeaturesSection() {
    this.apiService.get('Features/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.FeaturesSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getFeaturesSectionById() {
    this.apiService.get('Features/'+this.FeaturesSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.FeaturesSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.FeaturesSectionForm.patchValue({
      Title: this.FeaturesSectionData.title,
      SubTitle: this.FeaturesSectionData.subTitle,
      Comment: this.FeaturesSectionData.comment,
      FeaturesContent: this.attachFormArrayData(),
    });
  }

  attachFormArrayData() {
    this.FeaturesSectionData.featuresContent.forEach(element => {
      this.addFeatureContent(element.htmlContent);
    });
  }
 
  updateFeaturesSection() {
    this.submitted = true;
    if (this.FeaturesSectionForm.valid) {
      let payload = {
        Title: this.FeaturesSectionForm.value.Title,
        SubTitle: this.FeaturesSectionForm.value.SubTitle,
        Comment: this.FeaturesSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId,
        FeaturesContent: this.FeaturesSectionForm.value.FeaturesContent
      }
      this.apiService.post('Features', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Feature Section Data added successfully');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Feature Section Data error');
        }
      });
    }
  }

  approveFeaturesSection(event){
    let payload = {
      featuresId: this.FeaturesSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Features/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Features Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Features Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Features Section Data Approve error');
      }
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

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
