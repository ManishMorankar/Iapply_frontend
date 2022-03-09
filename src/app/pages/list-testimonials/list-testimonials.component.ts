import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-list-testimonials',
  templateUrl: './list-testimonials.component.html',
  styleUrls: ['./list-testimonials.component.scss']
})
export class ListTestimonialsComponent implements OnInit {
  testimonialsList: any = [];
  imageRes: SafeResourceUrl;
  testimonialForm: FormGroup;
  submitted = false;
  selectedImage;
  formData;
  currentUser;
  editImage;
  testimonialId;
  noImg;
  myFileInput: ElementRef;
  statusChanged: boolean = false;
  config = {
    keyboard: false,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };
  constructor(private router: Router, private _sanitizer: DomSanitizer, private toastMsg: ToastrService, private apiService: ApiService,
    private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.getTestimonialsList();
    this.currentUser = JSON.parse(localStorage.getItem("iApplyUser"));
    this.testimonialForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      Priority: ['', Validators.required],
      Description: ['', Validators.required]
    });
  }
  get cuf() { return this.testimonialForm.controls; }
  //createNew() {
  //  this.bsModalRef = this.modalService.show(CreateTestimonialsComponent, this.config);
  //}
  getTestimonialsList() {
    this.apiService.get('Testimonial')
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.testimonialsList = data.result;
        }
      }, err => {
        console.log(err.error)
      })
  }
  imageResult(result) {
    this.imageRes = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + result);
    return this.imageRes;
  }
  update(row) {
    this.testimonialId = row.testimonialId;
    this.testimonialForm.controls.Name.setValue(row.name);
    this.testimonialForm.controls.Priority.setValue(row.priority);
    this.testimonialForm.controls.Description.setValue(row.description);
    this.selectedImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + row.imageResult);
   
  }

  getImage() {
    if (this.selectedImage == null || this.selectedImage == undefined) {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
      return this.noImg;
     
    }
    else {
      return this.selectedImage;
    }
  }
  cancel() {
    this.testimonialForm.reset();
    this.selectedImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
  }

  removeFile() {
    this.selectedImage = "";
  }
  onFileChange(event) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size < 250000) {
      this.selectedImage = event.target.files[0];
      console.log(this.selectedImage)
      this.statusChanged = true;
    } else {
      this.toastMsg.error("Image size should be under 250kb")
    }
  }
  onSubmit() {
    this.submitted = true;
    this.formData = new FormData();
    if (this.testimonialForm.invalid) {
      this.toastMsg.warning('Please fill all mendatory  fields')
    }
    if (this.testimonialForm.valid) {
      if (!this.testimonialId) {
        this.formData.append('AddedBy', this.currentUser.userDetailsId);
        this.formData.append('Name', this.testimonialForm.value.Name);
        this.formData.append('Description', this.testimonialForm.value.Description);
        this.formData.append('Image', this.selectedImage);
        this.formData.append('Priority', this.testimonialForm.value.Priority);
        this.apiService.post('Testimonial', this.formData)
          .subscribe(data => {
            if (data.statusCode === "201" && data.result) {
              this.toastMsg.success('Testimonial added successfully');
              this.testimonialForm.reset();
              this.submitted = false;
              this.getTestimonialsList();
            }
          });
      }

      if (this.testimonialId) {
        this.formData.append('ModifiedBy', this.currentUser.userDetailsId);
        this.formData.append('Name', this.testimonialForm.value.Name);
        this.formData.append('Description', this.testimonialForm.value.Description);
       
          this.formData.append('Image', this.selectedImage);
       
        this.formData.append('Priority', this.testimonialForm.value.Priority);
        this.formData.append('TestimonialId', this.testimonialId);
        this.apiService.put('Testimonial', this.formData)
          .subscribe(data => {
            if (data.statusCode === "201" && data.result) {
              this.toastMsg.success('Testimonial upated successfully');
              this.testimonialForm.reset();
              this.submitted = false;
              this.getTestimonialsList();
            }
          });
      }
    }
  }
}
