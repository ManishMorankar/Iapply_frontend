import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-we-are-social',
  templateUrl: './we-are-social.component.html',
  styleUrls: ['./we-are-social.component.scss']
})
export class WeAreSocialComponent implements OnInit {

  ApprovedSocialMediaLinks;
  iApplyUser;
  currentUserType;
  WeAreSocialSectionForm: FormGroup;
  WeAreSocialSectionData: any;
  WeAreSocialSectionId: string;
  submitted: boolean;
  formData: FormData;
  SocialIconImage: any;
  noImg: SafeResourceUrl;
  selectedSocialIconImage: string;
  showForm: boolean = false;

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

    this.WeAreSocialSectionForm = this.formBuilder.group({
      SocialMediaName: ['', Validators.required],
      SocialMediaLink: ['', Validators.required],
      Comment: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe( params =>
      this.WeAreSocialSectionId= params['id']
    )
    if (this.WeAreSocialSectionId){
      this.getWeAreSocialSectionById();
    } else {
      this.getWeAreSocialSection();
    }

    this.getApprovedSocialMediaLinks();
  }

  getWeAreSocialSection() {
    this.apiService.get('SocialMedia/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WeAreSocialSectionData = data.result[0];
        // this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getSocialIconImage() {
    if (this.SocialIconImage == null || this.SocialIconImage == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;url,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.SocialIconImage);
    }
  }

  removeSocialIconImageFile() {
    this.selectedSocialIconImage = '';
  }

  onFileChangeSocialIconImage(event) {
    if (event.target.files[0].size < 3000000) {
      this.selectedSocialIconImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
  }

  getWeAreSocialSectionById() {
    this.apiService.get('SocialMedia/'+this.WeAreSocialSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.WeAreSocialSectionData = data.result[0];
        // this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  // attachFormData() {
  //   this.WeAreSocialSectionForm.patchValue({
  //     SocialMediaName: this.WeAreSocialSectionData.socialMediaName,
  //     SocialMediaLink: this.WeAreSocialSectionData.socialMediaLink,
  //     Comment: this.WeAreSocialSectionData.comment,
  //   });
  // }

  // attachFormData() {
  //   this.WeAreSocialSectionForm.patchValue({
  //     SocialMediaName: this.ApprovedSocialMediaLinks.socialMediaName,
  //     SocialMediaLink: this.ApprovedSocialMediaLinks.socialMediaLink,
  //     Comment: this.ApprovedSocialMediaLinks.comment,
  //   });
  // }

  attachFormData(row) {
    this.showForm = true;
    this.WeAreSocialSectionForm.patchValue({
      SocialMediaName: row.socialMediaName,
      SocialMediaLink: row.socialMediaLink,
      Comment: row.comment,
    });
    this.SocialIconImage = row.downloadLink;
  }

  getApprovedSocialMediaLinks(){
    this.apiService.get('SocialMedia/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.ApprovedSocialMediaLinks = data.result;
        // this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updateWeAreSocialSection() {
    this.submitted = true;
    if (this.WeAreSocialSectionForm.valid){
      this.formData = new FormData();
      if (this.selectedSocialIconImage){
        this.formData.append('SocialMediaIcon', this.selectedSocialIconImage);
      } else {
        // code for convert image data to file object
      }
      this.formData.append('SocialMediaName', this.WeAreSocialSectionForm.value.SocialMediaName);
      this.formData.append('SocialMediaLink', this.WeAreSocialSectionForm.value.SocialMediaLink);
      this.formData.append('Comment', this.WeAreSocialSectionForm.value.Comment);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);

      this.apiService.post('SocialMedia', this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('We Are Social Data error');
        }
      });
    }
  }

  approveWeAreSocialSection(event){

  }

}
