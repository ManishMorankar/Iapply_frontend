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
  selector: 'app-what-client-says-aboutus-section',
  templateUrl: './what-client-says-aboutus-section.component.html',
  styleUrls: ['./what-client-says-aboutus-section.component.scss']
})
export class WhatClientSaysAboutusSectionComponent implements OnInit {
  [x: string]: any;
  Editor = ClassicEditor;
  SectionData;
  WhatClientSaysAboutUsSectionForm: FormGroup;

  iApplyUser;
  submitted = false;
  PackagePageSectionDesc;
  Data;
  TestimonialSectionId: any;
  TestimonialSectionData: any;
  currentUserType;
  Image: any;
  noImg: any;
  selectedIconImage: any;
  Imagepath: any;
  testimonialContent: any;
  downloadLink: any;
  formData: FormData;
  selectedIconImageArray = [];
  imagePath: any;
  TestimonialCoontentSectionData: any;
  TestimonialContentSectionData: any;
  TestimonialContentSectionId: any;
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
      this.TestimonialSectionId= params['id']
    )
    if (this.TestimonialSectionId){
      this.getTestimonialSectionById();
    } else {
      this.getTestimonialSection();

    }
     if (this.TestimonialContentSectionId){
      this.getTestimonialContentSectionById();
    } else {
      this.getTestimonialContentSection();

    }

    this.WhatClientSaysAboutUsSectionForm = this.formBuilder.group({
      Title: ['', Validators.required],
      SubTitle: ['', Validators.required],
      Comment: ['', Validators.required],

    });

    this.TestimonialContentForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Designation: ['', Validators.required],
      SubTitleDesignation: [''],
      Description: ['', Validators.required],
      // Comment: ['', Validators.required],
    });
  }
  getTestimonialContentSectionById() {
    throw new Error('Method not implemented.');
  }

  get fsf() {
    return this.WhatClientSaysAboutUsSectionForm.controls;
  }

  get cuf() {
    return this.TestimonialContentForm.controls;
  }

  getImage()
  {
    if (this. Image == null || this. Image == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;url,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.Image);
    }
  }
  onFileChangeIconImage(event) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size < 1000000) {
      this.selectedIconImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
    if (this.selectedIconImage){
      this.selectedIconImageArray.push(this.selectedIconImage);
      }
  }

  removeIconImageFile() {
    this.selectedIconImage = "";
  }
  getTestimonialSection() {
    this.apiService.get('Testimonial/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.TestimonialSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }
  getTestimonialContentSection() {
    this.apiService.get('Testimonial/TestimonialContent/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.TestimonialContentSectionData = data.result[0];
        this.attachFormDataContent();
      }
    }, err => {
      console.log(err);
    });
  }
  getTestimonialSectionById() {
    this.apiService.get('Testimonial/'+this.TestimonialSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.TestimonialSectionData = data.result[0];
        this.testimonialContent = this.TestimonialSectionData.testimonialContent;
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.WhatClientSaysAboutUsSectionForm.patchValue({
      Title: this.TestimonialSectionData.title,
      SubTitle: this.TestimonialSectionData.subTitle,
      Comment: this.TestimonialSectionData.comment,
    });
  }
  attachFormDataContent()
  {
    this.TestimonialContentForm.patchValue({
      UserName: this.TestimonialContentSectionData.userName,
      Designation: this.TestimonialContentSectionData.designation,
      SubTitleDesignation: this.TestimonialContentSectionData.subTitleDesignation,
      Description: this.TestimonialContentSectionData.description,
      Comment: this.TestimonialContentSectionData.comment,
      Image :this.TestimonialContentSectionData.downloadLink
    });
    this.Image = this.TestimonialContentSectionData.downloadLink;
  }

  updateTestimonialSection() {
    this.submitted = true;
    console.log(this.WhatClientSaysAboutUsSectionForm.value);
    if (this.WhatClientSaysAboutUsSectionForm.valid) {
      // this.formData = new FormData();
      // this.formData.append('title',this.WhatClientSaysAboutUsSectionForm.value.Title);
      // this.formData.append('subTitle',this.WhatClientSaysAboutUsSectionForm.value.SubTitle);
      // this.formData.append('comment',this.WhatClientSaysAboutUsSectionForm.value.Comment);

      let payload = {
       Title: this.WhatClientSaysAboutUsSectionForm.value.Title,
       SubTitle: this.WhatClientSaysAboutUsSectionForm.value.SubTitle,
       Comment: this.WhatClientSaysAboutUsSectionForm.value.Comment,
       AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('Testimonial',payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Testimonial Section Data error');
        }
      });
    }
    }


  approveTestimonialSection(event){
    let payload = {
      testimonialId: this.TestimonialSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Testimonial/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Testimonial  Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Testimonial Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Testimonial Section Data Approve error');
      }
    });
  }


  updateTestimonialContentSection() {
    this.submitted = true;
    this.formData = new FormData();
    console.log(this.TestimonialContentForm.value);
    if (this.TestimonialContentForm.valid) {
      if (this.selectedIconImage){
        this.formData.append('Image', this.selectedIconImage);
      }
      else {
        // code for convert image data to file object

      }


      this.formData.append('UserName',this.TestimonialContentForm.value.UserName);
      this.formData.append('Designation',this.TestimonialContentForm.value.Designation);
      this.formData.append('SubTitleDesignation',this.TestimonialContentForm.value.SubTitleDesignation);
      this.formData.append('Description',this.TestimonialContentForm.value.Description);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);


      this.apiService.post('Testimonial/TestimonialContent',this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Testimonial Content Section Data error');
        }
      });
    }
    }
    approveTestimonialContentSection(event){
      let payload = {
        testimonialContentId: this.TestimonialContentSectionId,
        Status: event,
        ModifiedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('Testimonial/TestimonialContent/Approval', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          if(event=='Approved'){
            this.toastMsg.success('Testimonial Content Section Data approved successfully');
          }
          else if(event=='Rejected'){
            this.toastMsg.success('Testimonial Content Section Data rejected');
          }
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Testimonial Content Section Data Approve error');
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
