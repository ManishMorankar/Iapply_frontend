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
  selector: 'app-who-we-are-sub-section',
  templateUrl: './who-we-are-sub-section.component.html',
  styleUrls: ['./who-we-are-sub-section.component.scss']
})
export class WhoWeAreSubSectionComponent implements OnInit {
  Editor = ClassicEditor;
  iApplyUser;
  submitted = false;
  WhoWeAreSubSectionForm: FormGroup;
  WhoWeAreSubSectionId: any;
  WhoWeAreSubSectionData;
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
      this.WhoWeAreSubSectionId = params['id']
    )
    if (this.WhoWeAreSubSectionId){
      this.getWhoWeAreSubSectionById();
    } else {
      this.getWhoWeAreSubSection();
    }
    this.WhoWeAreSubSectionForm = this.formBuilder.group({
      Title: ['', Validators.required],
      SubTitle: ['', Validators.required],
      HtmlContent: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.WhoWeAreSubSectionForm.controls; }

  getWhoWeAreSubSection() {
    this.apiService.get('GetReadyToExploreWorldwideJobs/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WhoWeAreSubSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getWhoWeAreSubSectionById() {
    this.apiService.get('GetReadyToExploreWorldwideJobs/'+this.WhoWeAreSubSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WhoWeAreSubSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.WhoWeAreSubSectionForm.patchValue({
      Title: this.WhoWeAreSubSectionData.title,
      SubTitle: this.WhoWeAreSubSectionData.subTitle,
      HtmlContent: this.WhoWeAreSubSectionData.htmlContent,
      Comment: this.WhoWeAreSubSectionData.comment
    });
  }

  updateWhoWeAreSubSection() {
    this.submitted = true;
    if (this.WhoWeAreSubSectionForm.valid){
      let payload = {
        "Title": this.WhoWeAreSubSectionForm.value.Title,
        "SubTitle": this.WhoWeAreSubSectionForm.value.SubTitle,
        "HtmlContent": this.WhoWeAreSubSectionForm.value.HtmlContent,
        "Comment": this.WhoWeAreSubSectionForm.value.Comment,
        "AddedBy": this.iApplyUser.userDetailsId
      }

      this.apiService.post('GetReadyToExploreWorldwideJobs', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Get Ready To Explore Worldwide Jobs (Who We Are Sub Section) Data error');
        }
      });
    }
  }

  approveWhoWeAreSubSection(event){
    let payload = {
      WorldWideJobId: this.WhoWeAreSubSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('GetReadyToExploreWorldwideJobs/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Get Ready To Explore Worldwide Jobs (Who We Are Sub Section) Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Get Ready To Explore Worldwide Jobs (Who We Are Sub Section) Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Get Ready To Explore Worldwide Jobs (Who We Are Sub Section) Data Approve error');
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
