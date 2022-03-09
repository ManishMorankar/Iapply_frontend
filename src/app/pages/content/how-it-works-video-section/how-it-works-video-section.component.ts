import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-how-it-works-video-section',
  templateUrl: './how-it-works-video-section.component.html',
  styleUrls: ['./how-it-works-video-section.component.scss']
})
export class HowItWorksVideoSectionComponent implements OnInit {

  HowItWorksVideoSectionForm: FormGroup;
  iApplyUser: any;
  HowItWorksVideoId: any;
  HowItWorksVideoSectionData: any;
  submitted = false;
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
      this.HowItWorksVideoId = params['id']
    )
    if (this.HowItWorksVideoId){
      this.getHowItWorksVideoSectionById();
    } else {
      this.getHowItWorksVideoSection();
    }
    this.HowItWorksVideoSectionForm = this.formBuilder.group({
      VideoUrl: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.HowItWorksVideoSectionForm.controls; }

  getHowItWorksVideoSection() {
    this.apiService.get('HowItWorksVideo/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HowItWorksVideoSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getHowItWorksVideoSectionById() {
    this.apiService.get('HowItWorksVideo/'+this.HowItWorksVideoId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HowItWorksVideoSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }
  attachFormData() {
    this.HowItWorksVideoSectionForm.patchValue({
      VideoUrl: this.HowItWorksVideoSectionData.howItWorksVideoUrl,
      Comment: this.HowItWorksVideoSectionData.comment
    });
  }
  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }
  updatehowItWorksVideoSection(){
    this.submitted = true;
    if (this.HowItWorksVideoSectionForm.valid){
      let payload = {
        "HowItWorksVideoUrl": this.HowItWorksVideoSectionForm.value.VideoUrl,
        "Comment": this.HowItWorksVideoSectionForm.value.Comment,
        AddedBy:this.iApplyUser.userDetailsId
      }

      this.apiService.post('HowItWorksVideo', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Data error');
        }
      });
    }
  }

  approvehowItWorksVideoSection(event){
    let payload = {
      videoMasterId: this.HowItWorksVideoId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('HowItWorksVideo/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('How It Works Video approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('How It Works Video rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('How It Works Video Approve error');
      }
    });
  }

}
