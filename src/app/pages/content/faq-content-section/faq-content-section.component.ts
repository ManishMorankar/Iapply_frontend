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
  selector: 'app-faq-content-section',
  templateUrl: './faq-content-section.component.html',
  styleUrls: ['./faq-content-section.component.scss']
})
export class FaqContentSectionComponent implements OnInit {
  Editor = ClassicEditor;
  iApplyUser;
  submitted: boolean = false;
  FAQContentSectionForm: FormGroup;
  FAQContentSectionId: any;
  FAQContentData;
  selectedFAQContentImage;
  FAQContentImage;
  noImg;
  formData;
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
      this.FAQContentSectionId = params['id']
    )
    if (this.FAQContentSectionId){
      this.getFAQContentById();
    } else {
      this.getFAQContentData();
    }
    this.FAQContentSectionForm = this.formBuilder.group({
      Title: ['', Validators.required],
      SubTitle: ['', Validators.required],
      Description: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.FAQContentSectionForm.controls; }

  getFAQContentData() {
    this.apiService.get('Faq').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.FAQContentData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getFAQContentById() {
    this.apiService.get('Faq/'+this.FAQContentSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.FAQContentData = data.result[0];
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

  attachFormData() {
    this.FAQContentSectionForm.patchValue({
      Title: this.FAQContentData.title,
      SubTitle: this.FAQContentData.subTitle,
      Description: this.FAQContentData.description,
      Comment: this.FAQContentData.comment
    });
    this.FAQContentImage = this.FAQContentData.imageResult;
  }

  getFAQContentImage() {
    if (this.FAQContentImage == null || this.FAQContentImage == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.FAQContentImage);
    }
  }

  removeFAQContentImageFile() {
    this.selectedFAQContentImage = '';
  }

  onFileChangeFAQContentImage(event) {
    if (event.target.files[0].size < 1000000) {
      this.selectedFAQContentImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updateFAQContentSection() {
    this.submitted = true;
    if (this.FAQContentSectionForm.valid){
      this.formData = new FormData();
      if (this.selectedFAQContentImage){
        this.formData.append('Image', this.selectedFAQContentImage);
      } else {
        // code for convert image data to file object

      }
      this.formData.append('Title', this.FAQContentSectionForm.value.Title);
      this.formData.append('SubTitle', this.FAQContentSectionForm.value.SubTitle);
      this.formData.append('Description', this.FAQContentSectionForm.value.Description);
      this.formData.append('Comment', this.FAQContentSectionForm.value.Comment);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);

      this.apiService.post('Faq', this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('FAQ Content Section Data error');
        }
      });
    }
  }

  approveFAQContentSection(event){
    let payload = {
      FaqId: this.FAQContentSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Faq/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('FAQ Content Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('FAQ Content Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('FAQ Content Section Data Approve error');
      }
    });
  }

}
