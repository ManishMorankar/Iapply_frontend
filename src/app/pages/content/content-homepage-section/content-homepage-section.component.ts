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
  selector: 'app-content-homepage-section',
  templateUrl: './content-homepage-section.component.html',
  styleUrls: ['./content-homepage-section.component.scss']
})
export class ContentHomepageSectionComponent implements OnInit {
  HomePageSectionDesc;
  HomePageSectionData;
  iApplyUser;
  Comment;
  HomeSectionId;
  submitted = false;

  Editor = ClassicEditor;

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
      this.HomeSectionId = params['id']
    )
    if (this.HomeSectionId){
      this.getHomePageSectionById();
    } else {
      this.getHomePageSection();
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



  getHomePageSection(){
    this.apiService.get('WhoWeAre/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HomePageSectionData = data.result[0];
        this.HomePageSectionDesc = this.HomePageSectionData.whoWeAreData;
        if (this.HomeSectionId){
          this.Comment = this.HomePageSectionData.whoWeAreComment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  getHomePageSectionById(){
    this.apiService.get('WhoWeAre/'+this.HomeSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HomePageSectionData = data.result[0];
        this.HomePageSectionDesc = this.HomePageSectionData.sectionData;
        if (this.HomeSectionId){
          this.Comment = this.HomePageSectionData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  updateHomePageSection() {
    this.submitted = true;
    if (this.Comment && this.HomePageSectionDesc){
      let payload = {
        WhoWeAreData: this.HomePageSectionDesc,
        WhoWeAreComment: this.Comment,
        WhoWeAreStatus: 'Pending',
        AddedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('WhoWeAre', payload).subscribe(data => {
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

  onApproveRejectContent(action) {
    this.submitted = true;
    if (this.Comment && this.HomePageSectionDesc){
      let payload = {
        "WhoWeAreId": this.HomeSectionId,
        "WhoWeAreStatus": action,
        "ModifiedBy": this.iApplyUser.userDetailsId

      }
      this.apiService.post('WhoWeAre/Approval', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Who We Are section updated successfully');
          this.gotoContentUpdatePage();
        }
      }, err => {
        console.log(err.error.status)
        this.toastMsg.error(err.error.message);
      });
    }
  }

}
