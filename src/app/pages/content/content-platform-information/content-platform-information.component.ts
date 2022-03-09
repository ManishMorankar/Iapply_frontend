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
  selector: 'app-content-platform-information',
  templateUrl: './content-platform-information.component.html',
  styleUrls: ['./content-platform-information.component.scss']
})
export class ContentPlatformInformationComponent implements OnInit {
  PlaformInformationDesc;
  PlaformInformationData;
  iApplyUser;

  Editor = ClassicEditor;

  PlaformInformationId;
  submitted = false;
  Comment;


  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder,private activatedRoute:ActivatedRoute) { }


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
      this.PlaformInformationId = params['id']
    )
    if (this.PlaformInformationId){
      this.getPlatformInformationById();
    } else {
      this.getPlatformInformation();
    }
    this.getPlatformInformation();
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

  getPlatformInformation(){
    this.apiService.get('PlatformInformation/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.PlaformInformationData = data.result[0];
        this.PlaformInformationDesc = this.PlaformInformationData.sectionData;
        if (this.PlaformInformationId){
          this.Comment = this.PlaformInformationData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  getPlatformInformationById(){
    this.apiService.get('PlatformInformation/'+this.PlaformInformationId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.PlaformInformationData = data.result[0];
        this.PlaformInformationDesc = this.PlaformInformationData.sectionData;
        if (this.PlaformInformationId){
          this.Comment = this.PlaformInformationData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  updatePlaformInformation() {
    this.submitted = true;
    if (this.Comment && this.PlaformInformationDesc){
      let payload = {
        SectionData: this.PlaformInformationDesc,
        Comment: this.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('PlatformInformation', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
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


