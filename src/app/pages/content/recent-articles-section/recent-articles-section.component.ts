import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-recent-articles-section',
  templateUrl: './recent-articles-section.component.html',
  styleUrls: ['./recent-articles-section.component.scss']
})
export class RecentArticlesSectionComponent implements OnInit {

  Editor = ClassicEditor;
  SectionData;
  RecentArticlesSectionForm: FormGroup;

  iApplyUser;
  submitted = false;
  PackagePageSectionDesc;
  Data;
  BlogSectionId: any;
  BlogSectionData: any;
  currentUserType;
  IconImage: any;
  noImg: any;
  selectedIconImage: any;
  BlogContentSectionId: any;
  BlogContentSectionData: any;
  BlogContentForm: FormGroup;
  Image: any;
  selectedBlogImage: any;
  selectedBlogImageArray: any;
  formData: FormData;
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
      this.BlogSectionId= params['id']
    )
    if (this.BlogSectionId){
      this.getBlogSectionById();
    } else {
      this.getBlogSection();
    }
    this.RecentArticlesSectionForm = this.formBuilder.group({
      Title: ['', Validators.required],
      Comment: ['', Validators.required],
    });

    if (this.BlogContentSectionId){
      this.getBlogContentSectionById();
    } else {
      this.getBlogContentSection();
    }

    this.BlogContentForm = this.formBuilder.group({
    BlogTitle: ['', Validators.required],
      Description: ['', Validators.required],
     ShortDescription: ['', Validators.required],
     Comment: ['', Validators.required],
     BlogUrl: ['', Validators.required],
    });
  }

  get cuf() {
    return this.RecentArticlesSectionForm.controls;
  }
  getBlogSection() {
    this.apiService.get('Blog/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.BlogSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getBlogSectionById() {
    this.apiService.get('Blog/'+this.BlogSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.BlogSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.RecentArticlesSectionForm.patchValue({
      Title: this.BlogSectionData.title,
      Comment: this.BlogSectionData.comment,
    });
  }

  updateBlogSection() {
    this.submitted = true;
    console.log(this.RecentArticlesSectionForm.value);
    if (this.RecentArticlesSectionForm.valid) {
      let payload= {
        Title: this.RecentArticlesSectionForm.value.Title,
        Comment: this.RecentArticlesSectionForm.value.Comment,
        Addedby:this.iApplyUser.userDetailsId
      }
      this.apiService.post('Blog',payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Blog Section Data added successfully');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Blog Section Data error');
        }
      });
    }
  }

  approveBlogSection(event){
    let payload = {
      blogId: this.BlogSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Blog/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Blog Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Blog Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Blog Section Data Approve error');
      }
    });
  }

//Blog Content Section Data Added
get fsf() {
  return this.BlogContentForm.controls;
}
getBlogImage()
{
  if (this. Image == null || this. Image == undefined) {
    this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;url,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
    return this.noImg;
  }
  else {
    return this._sanitizer.bypassSecurityTrustResourceUrl(''+this.Image);
  }
}
onFileChangeBlogImage(event) {
  console.log(event.target.files[0]);
  if (event.target.files[0].size < 1000000) {
    this.selectedBlogImage = event.target.files[0];
  } else {
    this.toastMsg.error("Image size should be under 450kb")
  }
  if (this.selectedBlogImage){
    this.selectedBlogImageArray.push(this.selectedBlogImage);
    }
}
removeBlogImageFile() {
  this.selectedBlogImage = "";
}
getBlogContentSection()
{
  this.apiService.get('Blog/BlogContent/Approved').subscribe(data => {
    if (data.statusCode === '201' && data.result){
      this.BlogContentSectionData = data.result[0];
      this.attachFormContentData();
    }
  }, err => {
    console.log(err);
  });
}

getBlogContentSectionById(){
  this.apiService.get('Blog/BlogContent/'+this.BlogContentSectionId).subscribe(data => {
    if (data.statusCode === '201' && data.result){
      this.BlogContentSectionData = data.result[0];
      this.attachFormContentData();
    }
  }, err => {
    console.log(err);
  });
}

  attachFormContentData() {
    this.BlogContentForm.patchValue({
      BlogTitle: this.BlogContentSectionData.blogTitle,
      Description: this.BlogContentSectionData.description,
      ShortDescription: this.BlogContentSectionData.shortDescription,
      Comment: this.BlogContentSectionData.comment,
      BlogUrl: this.BlogContentSectionData.blogUrl,
      Image :this.BlogContentSectionData.downloadLink
    });
    this.Image = this.BlogContentSectionData.downloadLink;
  }

  updateBlogContentSection() {
    this.submitted = true;
    this.formData = new FormData();
    console.log(this.BlogContentForm.value);
    if (this.BlogContentForm.valid) {
      if (this.selectedBlogImage){
        this.formData.append('Image', this.selectedBlogImage);
      }
      else {
        // code for convert image data to file object

      }


      this.formData.append('BlogTitle',this.BlogContentForm.value.BlogTitle);   this.formData.append('BlogTitle',this.BlogContentForm.value.BlogTitle);
      this.formData.append('Description',this.BlogContentForm.value.Description);
      this.formData.append('ShortDescription',this.BlogContentForm.value.ShortDescription);
      this.formData.append('Comment',this.BlogContentForm.value.Comment);
      this.formData.append('BlogUrl',this.BlogContentForm.value.BlogUrl);
      this.formData.append('AddedBy', this.iApplyUser.userDetailsId);

      this.apiService.post('Blog/BlogContent',this.formData).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Blog Content Section Data error');
        }
      });
    }
    }

    approveBlogContentSection(event){
      let payload = {
       blogContentId: this.BlogContentSectionId,
        Status: event,
        ModifiedBy: this.iApplyUser.userDetailsId
      }
      this.apiService.post('Blog/BlogContent/Approval', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          if(event=='Approved'){
            this.toastMsg.success('Blog Content Section Data approved successfully');
          }
          else if(event=='Rejected'){
            this.toastMsg.success('Blog Content Section Data rejected');
          }
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Blog Content Section Data Approve error');
        }
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

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

}
