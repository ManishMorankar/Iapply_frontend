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
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

  Editor=ClassicEditor;
  SitemapSectionForm: FormGroup;
  submitted: boolean = false;
  iApplyUser;
  SitemapSectionId;
  SitemapData;
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
      this.SitemapSectionId = params['id']
    )
    if (this.SitemapSectionId){
      this.getSitemapById();
    } else {
      this.getSitemapData();
    }
    this.SitemapSectionForm = this.formBuilder.group({
      PageName: ['', Validators.required],
      PageNameLink: ['', Validators.required],
      Description: [''],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.SitemapSectionForm.controls; }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }

  getSitemapData() {
    this.apiService.get('SiteMap/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.SitemapData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getSitemapById() {
    this.apiService.get('SiteMap/'+this.SitemapSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.SitemapData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.SitemapSectionForm.patchValue({
      PageName: this.SitemapData.pageName,
      PageNameLink: this.SitemapData.pageNameLink,
      Description: this.SitemapData.description,
      Comment: this.SitemapData.comment
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updateSitemapSection(){
    this.submitted = true;
    if (this.SitemapSectionForm.valid){
      let payload = {
        PageName: this.SitemapSectionForm.value.PageName,
        PageNameLink: this.SitemapSectionForm.value.PageNameLink,
        Description: this.SitemapSectionForm.value.Description,
        Comment: this.SitemapSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('SiteMap', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        // console.log(err.error);
        if(err.error){
          this.toastMsg.error('Sitemap Section Data error');
        }
      });
    }
  }

  approveSitemapSection(event){
    let payload = {
      siteMapId: this.SitemapSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('SiteMap/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Sitemap Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Sitemap Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      // console.log(err.error);
      if (err.error){
        this.toastMsg.error('Sitemap Section Data Approve error');
      }
    });
  }

}

