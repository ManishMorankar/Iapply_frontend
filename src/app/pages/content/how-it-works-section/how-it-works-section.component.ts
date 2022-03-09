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
  selector: 'app-how-it-works-section',
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.scss']
})
export class HowItWorksSectionComponent implements OnInit {

  Editor = ClassicEditor;
  iApplyUser;
  submitted = false;
  HowItWorksSectionForm: FormGroup;
  HowItWorksSectionData
  HowItWorksSectionId: any;
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
      this.HowItWorksSectionId = params['id']
    )
    if (this.HowItWorksSectionId){
      this.getHowItWorksSectionById();
    } else {
      this.getHowItWorksSection();
    }
    this.HowItWorksSectionForm= this.formBuilder.group({
      Title: ['',Validators.required],
      Comment: ['', Validators.required],
      HowItWorksContent: this.formBuilder.array([]),

    });
  }

  get cuf() {
    return this.HowItWorksSectionForm.controls;
  }

  get HowItWorksContent() : FormArray {
    return this.HowItWorksSectionForm.get("HowItWorksContent") as FormArray
  }

  newHowItWorksContent(value,subTitlevalue): FormGroup {
    return this.formBuilder.group({
      HtmlContent: [value, Validators.required],
      SubTitle: [subTitlevalue, Validators.required],
    });
  }

  addHowItWorksContent(value,subTitlevalue) {
    this.HowItWorksContent.push(this.newHowItWorksContent(value,subTitlevalue));

  }

  removeHowItWorksContent(i:number) {
    if (this.HowItWorksContent.controls.length > 1){
      this.HowItWorksContent.removeAt(i);
    } else {
      this.toastMsg.error('Minimum 1 field is required');
    }
  }

  getHowItWorksSection() {
    this.apiService.get('HowItWorks/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HowItWorksSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getHowItWorksSectionById() {
    this.apiService.get('HowItWorks/'+this. HowItWorksSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HowItWorksSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.HowItWorksSectionForm.patchValue({
      Title: this.HowItWorksSectionData.title,
      Comment: this.HowItWorksSectionData.comment,
      HowItWorksContent: this.attachFormArrayData(),
    });
  }

  attachFormArrayData() {
    this.HowItWorksSectionData.howItWorksHtmlContent.forEach(element => {
      this.addHowItWorksContent(element.htmlContent,element.subTitle);
    });
  }

  updateHowItWorksSection() {
    this.submitted = true;
    console.log(this.HowItWorksSectionForm.value);
    if (this.HowItWorksSectionForm.valid) {
      let payload= {
        title: this.HowItWorksSectionForm.value.Title,
        comment: this.HowItWorksSectionForm.value.Comment,
        howItWorksHtmlContent: this.HowItWorksSectionForm.value.HowItWorksContent,
        AddedBy:this.iApplyUser.userDetailsId
      }
      this.apiService.post('HowItWorks',payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('HowItWorks Section Data error');
        }
      });
    }
  }

  approveHowItWorksSection(event){
    let payload = {
      howItWorksId: this.HowItWorksSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('HowItWorks/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('How It Works Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('How It Works Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('How It Works Section Data Approve error');
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
