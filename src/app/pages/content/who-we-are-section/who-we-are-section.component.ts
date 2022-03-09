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
  selector: 'app-who-we-are-section',
  templateUrl: './who-we-are-section.component.html',
  styleUrls: ['./who-we-are-section.component.scss']
})
export class WhoWeAreSectionComponent implements OnInit {

  Editor = ClassicEditor;
  noImg: any;
  iApplyUser: any;
  whoWeAreSectionId: any;
  WhoWeAreSectionForm: FormGroup;
  WhoWeAreSectionData: any;
  formData: FormData;
  submitted = false;
  selectedWhoWeAreImage;
  WhoWeAreImage;
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
      this.whoWeAreSectionId = params['id']
    )
    if (this.whoWeAreSectionId){
      this.getWhoWeAreSectionById();
    } else {
      this.getWhoWeAreSection();
    }
    this.WhoWeAreSectionForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      SubTitle: ['', Validators.required],
      HtmlContent: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.WhoWeAreSectionForm.controls; }

  getWhoWeAreImage() {
    if (this.WhoWeAreImage == null || this.WhoWeAreImage == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;url,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.WhoWeAreImage);
    }
  }

  removeWhoWeAreImageFile() {
    this.selectedWhoWeAreImage = '';
  }

  onFileChangeWhoWeAreImage(event) {
    if (event.target.files[0].size < 3000000) {
      this.selectedWhoWeAreImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }

  getWhoWeAreSection() {
    this.apiService.get('WhoWeAre/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WhoWeAreSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getWhoWeAreSectionById() {
    this.apiService.get('WhoWeAre/'+this.whoWeAreSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WhoWeAreSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.WhoWeAreSectionForm.patchValue({
      Title: this.WhoWeAreSectionData.title,
      SubTitle: this.WhoWeAreSectionData.subTitle,
      HtmlContent: this.WhoWeAreSectionData.htmlContent,
      Comment: this.WhoWeAreSectionData.comment
    });
    this.WhoWeAreImage = this.WhoWeAreSectionData.downloadLink;
  }

  updateWhoWeAreSection() {
    this.submitted = true;
    // console.log(this.WhoWeAreSectionData.value);
    if (this.WhoWeAreSectionForm.valid){
      this.formData = new FormData();
      this.formData.append('SubTitle', this.WhoWeAreSectionForm.value.SubTitle);
      this.formData.append('Title', this.WhoWeAreSectionForm.value.Title);
      this.formData.append('HtmlContent', this.WhoWeAreSectionForm.value.HtmlContent);
      this.formData.append('Comment', this.WhoWeAreSectionForm.value.Comment);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);
      if (this.selectedWhoWeAreImage){
        this.formData.append('Image', this.selectedWhoWeAreImage);
      }

      this.apiService.post('WhoWeAre', this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Who We Are Section Data error');
        }
      });
    }
  }

  approveWhoWeAreSection(event){
    let payload = {
      WhoWeAreId: this.whoWeAreSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('WhoWeAre/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Who We Are Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Who We Are Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Who We Are Section Data Approve error');
      }
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
