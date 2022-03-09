import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
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
  selector: 'app-content-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ContentHomeComponent implements OnInit{

 Editor=ClassicEditor;
  iApplyUser;
  submitted = false;

  HomeSectionForm: FormGroup;
  SEOSectionForm: FormGroup;

  HomeSectionId: any;
  HomeData;
  selectedBannerImage;
  selectedHeaderLogo;
  BannerImage;
  HeaderLogo;
  noImg;
  formData;
  SEOFormData;
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
      this.getHomeById();
    } else {
      this.getHome();
    }
    this.HomeSectionForm = this.formBuilder.group({
      LogoTitle: ['', Validators.required],
      LogoDescription: ['', Validators.required],
      Header: ['', Validators.required],
      Title: ['', [Validators.required]],
      Description: ['', Validators.required],
      Comment: ['', Validators.required]
    });

    this.SEOSectionForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Title: ['', [Validators.required]],
      Description: ['', Validators.required],
      Keywords: ['', Validators.required]
    });

  }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }

  get cuf() {
    return this.HomeSectionForm.controls;
  }

  getHome() {
    this.apiService.get('Home/HomeBanner').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HomeData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getHomeById() {
    this.apiService.get('Home/'+this.HomeSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.HomeData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.HomeSectionForm.patchValue({
      LogoTitle: this.HomeData.logoTitle,
      LogoDescription: this.HomeData.logoDescription,
      Header: this.HomeData.header,
      Title: this.HomeData.title,
      Description: this.HomeData.description,
      Comment: this.HomeData.comment
    });
    this.BannerImage = this.HomeData.bannerImageDownloadLink;
    this.HeaderLogo = this.HomeData.headerLogoDownloadLink;
  }

  getBannerImage() {
    if (this.BannerImage == null || this.BannerImage == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;url,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.BannerImage);
    }
  }

  getHeaderLogoImage() {
    if (this.HeaderLogo == null || this.HeaderLogo == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
    }
    else {
      return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.HeaderLogo);
    }
  }
  cancel() {
    this.HomeSectionForm.reset();
    this.selectedBannerImage = '';
    this.selectedHeaderLogo = '';
  }

  removeBannerImageFile() {
    this.selectedBannerImage = '';
  }

  removeHeaderLogoFile() {
    this.selectedHeaderLogo = '';
  }

  onFileChangeBannerImage(event) {
    if (event.target.files[0].size < 3000000) {
      this.selectedBannerImage = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
  }

  onFileChangeHeaderLogo(event) {
    if (event.target.files[0].size < 1000000) {
      this.selectedHeaderLogo = event.target.files[0];
    } else {
      this.toastMsg.error("Image size should be under 450kb")
    }
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updateHome() {
    this.submitted = true;
    if (this.HomeSectionForm.valid){
      this.formData = new FormData();
      if (this.selectedBannerImage){
        this.formData.append('BannerImage', this.selectedBannerImage);
      } else {
        // code for convert image data to file object

        // var file = this.dataURLtoFile(this.BannerImage, 'BannerImage.png');
        // this.formData.append('BannerImage', file);

        // var blob = this.dataURItoBlob(this.BannerImage);
        // var file = new File([blob], "fileName.jpeg", {
        //   type: "'image/jpeg'"
        // });
        // this.formData.append('BannerImage', file);
      }
      if (this.selectedHeaderLogo){
        this.formData.append('HeaderLogo', this.selectedHeaderLogo);
      }
      else{
        // var file = this.dataURLtoFile(this.HeaderLogo, 'HeaderLogoImage.png');
        // this.formData.append('HeaderLogo', file);

        // var blob = this.dataURItoBlob(this.HeaderLogo);
        // var file = new File([blob], "fileName.jpeg", {
        //   type: "'image/jpeg'"
        // });
        // this.formData.append('HeaderLogo', file);
      }
      this.formData.append('LogoTitle', this.HomeSectionForm.value.LogoTitle);
      this.formData.append('LogoDescription', this.HomeSectionForm.value.LogoDescription);
      this.formData.append('Header', this.HomeSectionForm.value.Header);
      this.formData.append('Title', this.HomeSectionForm.value.Title);
      this.formData.append('Description', this.HomeSectionForm.value.Description);
      this.formData.append('Comment', this.HomeSectionForm.value.Comment);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);

      this.apiService.post('Home/Add', this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Home Section Data added successfully');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Home Section Data error');
        }
      });
    }
  }

  // createBlobImageFileAndShow(): void {
  //   this.dataURItoBlob(this.base64TrimmedURL).subscribe((blob: Blob) => {
  //     const imageBlob: Blob = blob;
  //     const imageName: string = this.generateName();
  //     const imageFile: File = new File([imageBlob], imageName, {
  //       type: "image/jpeg"
  //     });
  //     this.generatedImage = window.URL.createObjectURL(imageFile);
  //     window.open(this.generatedImage);
  //   });
  // }

  // dataURLtoFile(dataurl, filename) {
  //   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  //       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  //       while(n--){
  //           u8arr[n] = bstr.charCodeAt(n);
  //       }
  //       return new File([u8arr], filename, {type:mime});
  //   }

  // dataURItoBlob(dataURI) {

  //   // convert base64/URLEncoded data component to raw binary data held in a string
  //   var byteString;
  //   if (dataURI.split(',')[0].indexOf('base64') >= 0)
  //       byteString = atob(dataURI.split(',')[1]);
  //   else
  //       byteString = unescape(dataURI.split(',')[1]);

  //   // separate out the mime component
  //   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  //   // write the bytes of the string to a typed array
  //   var ia = new Uint8Array(byteString.length);
  //   for (var i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([ia], {type:mimeString});
  // }

  // dataURItoBlob(dataURI: string): Observable<Blob> {
  //   return Observable.create((observer: Observer<Blob>) => {
  //     const byteString: string = window.atob(dataURI);
  //     const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
  //     const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
  //     for (let i = 0; i < byteString.length; i++) {
  //       int8Array[i] = byteString.charCodeAt(i);
  //     }
  //     const blob = new Blob([int8Array], { type: "image/jpeg" });
  //     observer.next(blob);
  //     observer.complete();
  //   });
  // }

  approveHomeSection(event){
    let payload = {
      HomeId: this.HomeSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Home/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Home Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Home Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Home Section Data Approve error');
      }
    });
  }

}

