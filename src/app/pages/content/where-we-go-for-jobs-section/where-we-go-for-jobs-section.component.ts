import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../service/api.service';
import { CountryList } from '../../../Constant';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-where-we-go-for-jobs-section',
  templateUrl: './where-we-go-for-jobs-section.component.html',
  styleUrls: ['./where-we-go-for-jobs-section.component.scss']
})
export class WhereWeGoForJobsSectionComponent implements OnInit {
  countryList = CountryList;
  whereWeGoForJobsSectionForm: FormGroup;
  iApplyUser;
  submitted = false;
  whereWeGoForJobsSectionId: any;
  whereWeGoForJobsSectionData;
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
      this.whereWeGoForJobsSectionId = params['id']
    )
    if (this.whereWeGoForJobsSectionId){
      this.getWhereWeGoForJobsSectionById();
    } else {
      this.getWhereWeGoForJobsSection();
    }
    this.whereWeGoForJobsSectionForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      Comment: ['', Validators.required],
    });
  }

  get cuf() {
    return this.whereWeGoForJobsSectionForm.controls;
  }

  getWhereWeGoForJobsSection() {
    this.apiService.get('GoForJobs/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.whereWeGoForJobsSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getWhereWeGoForJobsSectionById() {
    this.apiService.get('GoForJobs/'+this.whereWeGoForJobsSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.whereWeGoForJobsSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.whereWeGoForJobsSectionForm.patchValue({
      Title: this.whereWeGoForJobsSectionData.title,
      Comment: this.whereWeGoForJobsSectionData.comment,
    });
  }

  updateWhereWeGoForJobsSection() {
    this.submitted = true;
    if (this.whereWeGoForJobsSectionForm.valid) {
      let payload = {
        Title: this.whereWeGoForJobsSectionForm.value.Title,
        Comment: this.whereWeGoForJobsSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId,
      }
      this.apiService.post('GoForJobs', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Where we go for jobs Section Data error');
        }
      });
    }
  }

  approveWhereWeGoForJobsSection(event){
    let payload = {
      goForJobsId: this.whereWeGoForJobsSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('GoForJobs/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Where we go for jobs Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Where we go for jobs Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Where we go for jobs Section Data Approve error');
      }
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
