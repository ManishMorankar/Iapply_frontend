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
  selector: 'app-contact-us-section',
  templateUrl: './contact-us-section.component.html',
  styleUrls: ['./contact-us-section.component.scss']
})
export class ContactUsSectionComponent implements OnInit {
  iApplyUser: any;
  ContactUsSectionForm:FormGroup;
  ContactUsSectionId: any;
  ContactUsSectionData: any;
  submitted = false;
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
    this.activatedRoute.params.subscribe( params =>
      this.ContactUsSectionId = params['id']
    )
    if (this.ContactUsSectionId){
      this.getContactUsSectionId();
    } else {
      this.getContactUsSectionData();
    }
    this.  ContactUsSectionForm = this.formBuilder.group({
       Title: ['', Validators.required],
       Description: ['', Validators.required],
       Comment: ['', Validators.required]
    });
  }
  get cuf() {
    return this.ContactUsSectionForm .controls;
  }
  getContactUsSectionData()
  {
    this.apiService.get('ContactUsSection/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.ContactUsSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }
  getContactUsSectionId()
  {
    this.apiService.get('ContactUsSection/'+this.ContactUsSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.ContactUsSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }
  attachFormData() {
    this.ContactUsSectionForm.patchValue({
      Title:this.ContactUsSectionData.title,
      Description:this.ContactUsSectionData.description,
      Comment: this.ContactUsSectionData.comment
    });
  }

  updateContactUsSection()
  {
    this.submitted = true;
    if (this.ContactUsSectionForm.valid){
      let payload = {
        title: this.ContactUsSectionForm.value.Title,
        description : this.ContactUsSectionForm.value.Description,
        Comment: this.ContactUsSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('ContactUsSection', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Contact Us Section Data error');
        }
      });
    }
  }
  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
