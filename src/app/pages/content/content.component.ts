import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
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
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  currentUser;
  selectedContentOption = 'content';
  aboutUsData;
  visionMissionData;
  subscriptionsData;

  aboutUsDesc = "";
  visionDesc = "";
  missionDesc = "";

  associationForm: FormGroup;
  AssocitionData;
  imageResult: SafeResourceUrl;
  noImg;
  companyImage;
  formData;
  association_id;
  selectedImage: SafeResourceUrl;

  @ViewChild('removeImageButton', {static: false}) removeImageButton: ElementRef;

  Editor = ClassicEditor;

  UploadVideoForm: FormGroup;
  VideoId;
  videosData:string;
  videoResult: SafeResourceUrl;
  video: any;
  submitted: boolean;
  currentUserDetailsId: any;
  currentUserType: any;
  currentCustomerId: any;
  iApplyUser: any;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder,) { }

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
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.getAboutUs();
    this.getVisionMission();
    this.getSubscriptions();
    this.getAssociations();
    this.getVideos();

    this.associationForm = this.formBuilder.group({
      CompanyName:['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      Priority:['', [Validators.required]]
    });

    this.videoResult = this._sanitizer.bypassSecurityTrustResourceUrl(this.videosData);

    this.UploadVideoForm = this.formBuilder.group({
      VideoUrl:['', Validators.required],
     VideoTitle:['', Validators.required],
   Description:['', Validators.required],
    });

    if (localStorage.getItem("video")) {
      this.video = JSON.parse(localStorage.getItem("video"))
    }
    if (this.video){
      this.attachFormData();
    }
  }

  onContentOptionSelected(item) {
    this.selectedContentOption = item;
  }
  get cuf() { return this.associationForm.controls; }

  getAssociations(){
    this.apiService.get('Association').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.AssocitionData = data.result
        this.imageResult = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data.result[0].imageResult);
        console.log(this.AssocitionData)
      }
    }, );
  }

  onFileChange(event) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size < 250000) {
      this.selectedImage = <File> event.target.files[0];
      console.log(this.selectedImage);
    } else {
      this.toastMsg.error("Image size should be under 250kb")
    }
  }

  getImage() {
    if (this.selectedImage == null || this.selectedImage == undefined || this.selectedImage == '') {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this.selectedImage;
    }
  }

  updateAssociation(row) {
    this.association_id = row.associationId;
    this.associationForm.controls.CompanyName.setValue(row.title);
    this.associationForm.controls.Priority.setValue(row.priority);
    this.selectedImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + row.imageResult);

  }

  removeFile() {
    this.selectedImage = "";
  }

  onSubmit(){
    console.log(this.associationForm.value);
    this.formData = new FormData();
    if (this.associationForm.invalid) {
      this.toastMsg.warning('Please fill all mandatory  fields');
      // return;
    }
    if (this.associationForm.valid) {
      if (!this.association_id) {
    // this.formData = new FormData();
    this.formData.append('AddedBy', this.currentUser.userDetailsId);
    this.formData.append('Title', this.associationForm.value.CompanyName);
    this.formData.append('Priority', this.associationForm.value.Priority);
    if (this.selectedImage){
      this.formData.append('Image', this.selectedImage);
    }

    this.apiService.post('Association', this.formData)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.toastMsg.success('Association added successfully');
          this.associationForm.reset();
          this.removeFile();
          this.removeImageButton.nativeElement.dispatchEvent(new MouseEvent('click'));
          this.getAssociations();
        }
      });

  }

  if (this.association_id) {
    // this.formData = new FormData();
    this.formData.append('ModifiedBy', this.currentUser.userDetailsId);
    this.formData.append('Title', this.associationForm.value.CompanyName);
    this.formData.append('Priority', this.associationForm.value.Priority);
    this.formData.append('AssociationId', this.association_id);
    if (this.selectedImage){
      this.formData.append('Image', this.selectedImage);
    }

    this.apiService.put('Association', this.formData)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.toastMsg.success('Association updated successfully');
          this.associationForm.reset();
          this.removeFile();
          this.removeImageButton.nativeElement.dispatchEvent(new MouseEvent('click'));
          this.getAssociations();
        }
      });

  }
}
  }

  deleteAssociation(event){
    this.apiService.post('Association/' +event, event)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.toastMsg.success('Association deleted successfully');
          this.getAssociations();
        }
  });
}
  attachFormData(){
    this. UploadVideoForm.controls.VideoUrl.setValue(this.video.videoUrl);
    this. UploadVideoForm.controls.VideoTitle.setValue(this.video.title);
    this. UploadVideoForm.controls.Description.setValue(this.video.description);
  }

  getVideos(){
    this.apiService.get('Video').subscribe(data=> {
      if (data.statusCode === '201' && data.result){
        this.videosData = data.result;
        console.log(this.videosData)

      }
    },
    error => {
      console.log(error);
    });
  }
  getSanitizedVideoUrl(url){
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onSubmitVideo(){
    this.submitted = true;
    console.log(this.UploadVideoForm.value);
    if (this.UploadVideoForm.valid) {
      let payload= {
        VideoId:this.UploadVideoForm.value.videoId,
        VideoUrl: this.UploadVideoForm.value.VideoUrl,
        Title: this.UploadVideoForm.value.VideoTitle,
        Description: this.UploadVideoForm.value.Description,
      }
    if (this.UploadVideoForm.valid) {
      if (this.VideoId){
        payload['videoId'] = this.video.videoId;
        this.apiService.put('Video', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('Video  Details updated successfully');
            this.router.navigate(['app/content']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Video update error');
          }
        });
      } else{
        this.apiService.post('Video', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('video added successfully');
            this.UploadVideoForm.reset();
            this.router.navigate(['app/content']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Video add error');
          }
        });

      }

    }
    }


  }

  deleteVideos(event){
    this.apiService.post('Video/' +event, event)
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.toastMsg.success('Video deleted successfully');
          this.getVideos();
        }
  });
  }

  get uf(){
    return this. UploadVideoForm.controls;
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

  getAboutUs() {
    this.apiService.get('AboutUs').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.aboutUsData = data.result[0];
        this.aboutUsDesc = this.aboutUsData.description;
      }
    }, err => {
      console.log(err);
    });
  }

  getVisionMission() {
    this.apiService.get('VisionMission').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.visionMissionData = data.result[0];
        this.visionDesc = this.visionMissionData.vision;
        this.missionDesc = this.visionMissionData.mission;
      }
    }, err => {
      console.log(err);
    });
  }

  getSubscriptions() {
    this.apiService.get('CustomerSubscription').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.subscriptionsData = data.result;
        console.log(this.subscriptionsData)
      }
    }, err => {
      console.log(err);
    });
  }

  updateAboutUs() {
    let payload = {
      "AboutUsId": this.aboutUsData.aboutUsId,
      "Titlie": "About Us",
      "Description": this.aboutUsDesc,
      "ModifiedBy": this.currentUser.userDetailsId
    }
    this.apiService.put('AboutUs', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.toastMsg.success('About us updated successfully');
      }
    }, err => {
      console.log(err.error.status)
      this.toastMsg.error(err.error.message);
    });
  }

  updateVisionMission() {
    let payload = {
      "AboutUsId": this.visionMissionData.visionMissionId,
      "Vision": this.visionDesc,
      "Mission": this.missionDesc,
      "ModifiedBy": this.currentUser.userDetailsId
    }
    this.apiService.put('VisionMission', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.toastMsg.success('Vision Mission updated successfully');
      }
    }, err => {
      console.log(err.error.status)
      this.toastMsg.error(err.error.message);
    });
  }

  updateSubscriptions() {

  }

  exportToExcel() {

  }

  submitSubscription() {

  }

  editTestimonial() {
    this.router.navigate(['app/testimonial']);
  }

}
