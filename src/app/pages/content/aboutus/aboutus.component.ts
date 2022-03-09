import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

// ClassicEditor
// 	.create( document.querySelector( '#editor' ), {
// 		plugins: [ ImageResize ],
// 	} )
// 	.then( editor => {
// 		console.log( 'Editor was initialized', editor );
// 	} )
// 	.catch( error => {
// 		console.error( error.stack );
// 	} );

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
  selector: 'app-content-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class ContentAboutusComponent implements OnInit {

  aboutUsData;
  aboutUsDesc;
  iApplyUser;

  Editor = ClassicEditor;

  Comment: any;
  AboutUsId: any;
  submitted = false;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private activatedRoute:ActivatedRoute) { 
    }

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
      this.AboutUsId = params['id']
    )
    if (this.AboutUsId){
      this.getAboutUsById();
    } else {
      this.getAboutUs();
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

  getAboutUs() {
    this.apiService.get('AboutUs/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.aboutUsData = data.result[0];
        this.aboutUsDesc = this.aboutUsData.sectionData;
        if (this.AboutUsId){
          this.Comment = this.aboutUsData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  getAboutUsById() {
    this.apiService.get('AboutUs/'+this.AboutUsId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.aboutUsData = data.result[0];
        this.aboutUsDesc = this.aboutUsData.sectionData;
        if (this.AboutUsId){
          this.Comment = this.aboutUsData.comment;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  updateAboutUs() {
    this.submitted = true;
    if (this.Comment && this.aboutUsDesc){
      let payload = {
        SectionData: this.aboutUsDesc,
        Comment: this.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('AboutUs', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('About us added successfully');
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
