import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-where-we-go-for-jobs-subsection',
  templateUrl: './where-we-go-for-jobs-subsection.component.html',
  styleUrls: ['./where-we-go-for-jobs-subsection.component.scss']
})
export class WhereWeGoForJobsSubsectionComponent implements OnInit {
  selectedIconImage;
  IconImage;
  noImg;
  whereWeGoForJobsSubSectionForm: FormGroup;
  whereWeGoForJobsSubSectionId: any;
  whereWeGoForJobsSubSectionData;
  iApplyUser;
  submitted = false;
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
      this.whereWeGoForJobsSubSectionId = params['id']
    )
    if (this.whereWeGoForJobsSubSectionId){
      this.getWhereWeGoForJobsSubSectionById();
    } else {
      this.getWhereWeGoForJobsSubSection();
    }
    this.whereWeGoForJobsSubSectionForm = this.formBuilder.group({
      Count: ['', Validators.required],
      Comment: ['', [Validators.required,]],
      Heading: ['', Validators.required],
    });
  }
  get cuf() { return this.whereWeGoForJobsSubSectionForm.controls; }

  getWhereWeGoForJobsSubSection() {
    this.apiService.get('JobsAvailablityCounter/JobsAvailablityCounterContent/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.whereWeGoForJobsSubSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getWhereWeGoForJobsSubSectionById() {
    this.apiService.get('JobsAvailablityCounter/JobsAvailablityCounterContent/'+this.whereWeGoForJobsSubSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.whereWeGoForJobsSubSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.whereWeGoForJobsSubSectionForm.patchValue({
      Count: this.whereWeGoForJobsSubSectionData.count,
      Comment: this.whereWeGoForJobsSubSectionData.comment,
      Heading: this.whereWeGoForJobsSubSectionData.heading,
    });
    // if (this.whereWeGoForJobsSubSectionData.downloadLink) {
      this.IconImage = this.whereWeGoForJobsSubSectionData.downloadLink;
    // }
  }



  getIconImage() {
    if (this.IconImage == null || this.IconImage == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;url,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.IconImage);
    }
  }

  onFileChangeIconImage(event) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size < 1000000) {
      this.selectedIconImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
  }

  removeIconImageFile() {
    this.selectedIconImage = "";
  }

  updateJobIconCounter(){
    this.submitted = true;
    if (this.whereWeGoForJobsSubSectionForm.valid){

      this.formData = new FormData();
      if (this.selectedIconImage){
        this.formData.append('Icon', this.selectedIconImage);
      } else {
        // code for convert image data to file object

      }
      this.formData.append('Count', this.whereWeGoForJobsSubSectionForm.value.Count);
      this.formData.append('Comment', this.whereWeGoForJobsSubSectionForm.value.Comment);
      this.formData.append('Heading', this.whereWeGoForJobsSubSectionForm.value.Heading);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);

      this.apiService.post('JobsAvailablityCounter/JobsAvailablityCounterContent', this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Job Counter Section Data error');
        }
      });
    }
  }

  approveJobIconCounter(event){
    let payload = {
      jobsAvailablityCounterContentId: this.whereWeGoForJobsSubSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('JobsAvailablityCounter/JobsAvailablityCounterContent/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Job Counter Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Job Counter Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Job Counter Section Data Approve error');
      }
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
