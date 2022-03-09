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
  selector: 'app-who-we-serve-section',
  templateUrl: './who-we-serve-section.component.html',
  styleUrls: ['./who-we-serve-section.component.scss']
})
export class WhoWeServeSectionComponent implements OnInit {

  Editor = ClassicEditor;
  selectedWhoWeServeImage: any;
  selectedWhoWeServeImageArray = [];
  WhoWeServeImage;
  noImg: any;
  iApplyUser: any;
  WhoWeServeSectionId: any;
  WhoWeServeSectionForm: FormGroup;
  WhoWeServeSectionData: any;
  formData: FormData;
  submitted = false;
  WhoWeServeBottomImage: any;
  WhoWeServeLongImage: any;
  selectedWhoWeServeLongImage: string;
  selectedWhoWeServeBottomImage: string;
  imagePath: any;
  ImageSection: any;
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
      this.WhoWeServeSectionId = params['id']
    )
    if (this.WhoWeServeSectionId){
      this.getWhoWeServeSectionById();
    } else {
      this.getWhoWeServeSection();
    }
    this.WhoWeServeSectionForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      HtmlContent: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() {
    return this.WhoWeServeSectionForm.controls;
  }

  getWhoWeServeSection() {
    this.apiService.get('WhoWeServe/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WhoWeServeSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getWhoWeServeSectionById() {
    this.apiService.get('WhoWeServe/'+this.WhoWeServeSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WhoWeServeSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.WhoWeServeSectionForm.patchValue({
      Title: this.WhoWeServeSectionData.title,
      HtmlContent: this.WhoWeServeSectionData.htmlContent,
      Comment: this.WhoWeServeSectionData.comment
    });
   // this.imagePath = this.WhoWeServeSectionData.imagePath[0];



  }
//WhoWeServeImage Section
  /*getWhoWeServeImage() {
    if (this.imagePath == null || this.imagePath == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.imagePath);
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.imagePath[1]);
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.imagePath[2]);
    }
  }*/
  getWhoWeServeImage(index) {
    if(this.WhoWeServeSectionData.imagePath.length>0)
    {
    this.imagePath = this.WhoWeServeSectionData.imagePath[index]
    }
    if (this.imagePath == null || this.imagePath == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.imagePath);
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.imagePath[1]);
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.imagePath[2]);
    }
  }

  removeWhoWeServeImageFile() {
    this.selectedWhoWeServeImage = "";
  }

  onFileChangeWhoWeServeImage(event) {
    if (event.target.files[0].size < 1000000) {
      this.selectedWhoWeServeImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 1mb")
    }
    if (this.selectedWhoWeServeImage){
    this.selectedWhoWeServeImageArray.push(this.selectedWhoWeServeImage);
    }
  }

//More Images add




  updateWhoWeServeSection() {
    this.submitted = true;
    console.log(this.WhoWeServeSectionForm.value);
    if (this.WhoWeServeSectionForm.valid){
      this.formData = new FormData();
      // if (this.selectedWhoWeServeImage){
      //   let selectedWhoWeServeImageArray = [this.selectedWhoWeServeImage]
      //   this.formData.append('Images', JSON.stringify(selectedWhoWeServeImageArray));
      // }
     /* if (this.selectedWhoWeServeImage){
        let selectedWhoWeServeImageArray = [this.selectedWhoWeServeImage]
        this.formData.append('Images', this.imagePath);

      }*/
      for(let i=0;i<this.selectedWhoWeServeImageArray.length;i++)
      {
        this.formData.append('Images', this.selectedWhoWeServeImageArray[i]);
      }
      this.formData.append('Title', this.WhoWeServeSectionForm.value.Title);
      this.formData.append('HtmlContent', this.WhoWeServeSectionForm.value.HtmlContent);
      this.formData.append('Comment', this.WhoWeServeSectionForm.value.Comment);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);

      this.apiService.post('WhoWeServe', this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Who we serve Section Data error');
        }
      });
    }
  }

  approveWhoWeServeSection(event){
    let payload = {
      WhoWeServeId: this.WhoWeServeSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('WhoWeServe/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Who We Serve Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Who We Serve Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Who We Serve Section Data Approve error');
      }
    });
  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(
      loader
    ) {
      console.log('loader : ', loader);
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
    console.log( data );
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
