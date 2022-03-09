import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  Editor = ClassicEditor;
  iApplyUser: any;
  CookiesSectionId: any;
  CookiesSectionForm: FormGroup;
  CookiesSectionData: any;
  submitted = false;
  currentUserType;
  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.iApplyUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.activatedRoute.params.subscribe( params =>
      this.CookiesSectionId = params['id']
    )
    if (this.CookiesSectionId){
      this.getCookiesSectionById();
    } else {
      this.getCookiesSection();
    }
    this.CookiesSectionForm = this.formBuilder.group({
      HtmlContent: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.CookiesSectionForm.controls; }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function(loader) {
      return new UploadAdapter(loader);
    };
  }

  onChange( { editor }: ChangeEvent ) {
    let data = editor.getData();
  }

  getCookiesSection() {
    this.apiService.get('Cookies/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.CookiesSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getCookiesSectionById() {
    this.apiService.get('Cookies/'+this.CookiesSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.CookiesSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.CookiesSectionForm.patchValue({
      HtmlContent: this.CookiesSectionData.htmlContent,
      Comment: this.CookiesSectionData.comment
    });
  }

  updateCookiesSection() {
    this.submitted = true;
    if (this.CookiesSectionForm.valid){
      let payload = {
        HtmlContent: this.CookiesSectionForm.value.HtmlContent,
        Comment: this.CookiesSectionForm.value.Comment
      }
      this.apiService.post('Cookies', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Cookies Section Data added successfully');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Cookies Section Data error');
        }
      });
    }
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
