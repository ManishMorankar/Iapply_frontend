import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

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
  selector: 'app-content-visionmission',
  templateUrl: './visionmission.component.html',
  styleUrls: ['./visionmission.component.scss']
})
export class ContentVisionmissionComponent implements OnInit {
  VisionMissionDesc;
  iApplyUser;
  VisionMissionData;
  Comment;
  Editor = ClassicEditor;
  missionDesc;
  visionDesc;
  VisionMissionId;
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
      this.VisionMissionId = params['id']
    )
    if (this.VisionMissionId){
      this.getVisionMissionById();
    } else {
      this.getVisionMission();
    }
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
  getVisionMission() {
    this.apiService.get('VisionMission/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.VisionMissionData = data.result[0];
        this.visionDesc = this.VisionMissionData.vision;
        this.missionDesc = this.VisionMissionData.mission;
        if (this.VisionMissionId){
          this.Comment = this.VisionMissionData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  getVisionMissionById() {
    this.apiService.get('VisionMission/'+this.VisionMissionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.VisionMissionData = data.result[0];
        this.visionDesc = this.VisionMissionData.vision;
        this.missionDesc = this.VisionMissionData.mission;
        if (this.VisionMissionId){
          this.Comment = this.VisionMissionData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  updateVisionMission() {
    this.submitted = true;
    if (this.Comment && this.visionDesc && this.missionDesc){
      let payload = {
        Vision: this.visionDesc,
        Mission: this.missionDesc,
        Comment: this.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('VisionMission', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('VisionMission added successfully');
          this.gotoContentUpdatePage();
        }
      }, err => {
        console.log(err.error.status)
        this.toastMsg.error(err.error.message);
      });
    }
  }

  gotoContentUpdatePage() {
    this.router.navigate(['/app/contentUpdate']);
  }

}

