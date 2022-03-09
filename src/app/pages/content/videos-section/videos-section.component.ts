import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-videos-section',
  templateUrl: './videos-section.component.html',
  styleUrls: ['./videos-section.component.scss']
})
export class VideosSectionComponent implements OnInit {
  iApplyUser;
  submitted = false;
  VideoSectionForm: FormGroup;
  VideoData;
  VideoSectionId: any;
  videoMasterId;
  videoSectionId;
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
      this.videoSectionId = params['id']
    )
    if (this.videoSectionId){
      this.getVideoById();
    } else {
      this.getVideo();
    }
    this.VideoSectionForm = this.formBuilder.group({
      VideoUrl: ['', Validators.required],
     Comment: ['', Validators.required]
    });
  }
  getVideo() {
    this.apiService.get('VideoMaster/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.VideoData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getVideoById() {
    this.apiService.get('VideoMaster/'+this.videoSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.VideoData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this. VideoSectionForm.patchValue({
      VideoUrl: this.VideoData.videoMasterUrl,
      Comment: this.VideoData.comment
    });
  }

  updateVideo() {
    this.submitted = true;
    console.log(this.VideoSectionForm.value);
    if (this.VideoSectionForm.valid){
    let payload= {
      videoMasterUrl:this.VideoSectionForm.value.VideoUrl,
       comment:this.VideoSectionForm.value.Comment,
  AddedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('VideoMaster',payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Video added successfully');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Video Data error');
        }
      });
    }
  }

  approveVideo(event){
    let payload = {
      videoMasterId: this.videoSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('VideoMaster/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Video approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Video rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Video Approve error');
      }
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
