import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-choose-your-package-section',
  templateUrl: './choose-your-package-section.component.html',
  styleUrls: ['./choose-your-package-section.component.scss']
})
export class ChooseYourPackageSectionComponent implements OnInit {

  iApplyUser;
  submitted = false;
  Editor = ClassicEditor;
  SectionData;
  PackagePageSectionDesc;
  Data;
  ChooseYourPackageSectionForm: FormGroup;
  PackageSectionId: any;
  PackageSectionData: any;
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
      this.PackageSectionId= params['id']
    )
    if (this.PackageSectionId){
      this.getPackageSectionById();
    } else {
      this.getPackageSection();
    }
    this.ChooseYourPackageSectionForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      SubTitle: ['', Validators.required],
      Comment: ['', Validators.required],
      PackageContent: this.formBuilder.array([]),
    });
  }

  get cuf() {
    return this.ChooseYourPackageSectionForm.controls;
  }

  get  PackageContent() : FormArray {
    return this.ChooseYourPackageSectionForm.get("PackageContent") as FormArray
  }

  newPackageContent(value,PackageNamevalue,PackagePricevalue,PackagePeriodvalue): FormGroup {
    return this.formBuilder.group({
      HtmlContent: [value, Validators.required],
      PackageName: [PackageNamevalue, Validators.required],
      PackagePrice: [PackagePricevalue, Validators.required],
      PackagePeriod: [PackagePeriodvalue, Validators.required],
    });
  }

  addPackageContent(value,PackageNamevalue,PackagePricevalue,PackagePeriodvalue) {
    this.PackageContent.push(this.newPackageContent(value,PackageNamevalue,PackagePricevalue,PackagePeriodvalue));
  }

  removePackageContent(i:number) {
    if (this.PackageContent.controls.length > 1){
      this.PackageContent.removeAt(i);
    } else {
      this.toastMsg.error('Minimum 1 field is required');
    }
  }

  getPackageSection() {
    this.apiService.get('Package/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.PackageSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getPackageSectionById() {
    this.apiService.get('Package/'+this.PackageSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.PackageSectionData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.ChooseYourPackageSectionForm.patchValue({
      Title: this.PackageSectionData.title,
      SubTitle: this.PackageSectionData.subTitle,
      Comment: this.PackageSectionData.comment,
      PackageContent: this.attachFormArrayData(),
    });
  }

  attachFormArrayData() {
    this.PackageSectionData.packageContent.forEach(element => {
      this.addPackageContent(element.htmlContent,element.packageName,element.packagePrice,element.packagePeriod);
    });
  }

  updatePackageSection(){
    this.submitted = true;
    console.log(this.ChooseYourPackageSectionForm.value);
    if (this.ChooseYourPackageSectionForm.valid) {
      let payload= {
        title: this.ChooseYourPackageSectionForm.value.Title,
        subTitle: this.ChooseYourPackageSectionForm.value.SubTitle,
        comment: this.ChooseYourPackageSectionForm.value.Comment,
        PackageContent: this.ChooseYourPackageSectionForm.value.PackageContent,
        AddedBy:this.iApplyUser.userDetailsId
       }
      this.apiService.post('Package',payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
          this.onCancel();
        }
      }, err => {
        console.log(err.error)
        if (err.error){
          this.toastMsg.error('Package Section Data error');
        }
      });
    }
  }

  approvePackageSection(event){
    let payload = {
      packageId: this.PackageSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Package/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('Package Section Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('Package Section Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('Package Section Data Approve error');
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
