import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-lets-talk',
  templateUrl: './lets-talk.component.html',
  styleUrls: ['./lets-talk.component.scss']
})
export class LetsTalkComponent implements OnInit {

  LetsTalkSectionForm: FormGroup;
  iApplyUser;
  submitted: boolean = false;
  LetsTalkSectionId: any;
  LetsTalkData;
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
      this.LetsTalkSectionId = params['id']
    )
    if (this.LetsTalkSectionId){
      this.getLetsTalkSectionById();
    } else {
      this.getLetsTalkData();
    }
    this.LetsTalkSectionForm = this.formBuilder.group({
      LetsTalkEmail: ['', Validators.required],
      CopyrightContent: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }

  get cuf() { return this.LetsTalkSectionForm.controls; }

  getLetsTalkData() {
    this.apiService.get('FooterContent/Approved').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.LetsTalkData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getLetsTalkSectionById() {
    this.apiService.get('FooterContent/'+this.LetsTalkSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.LetsTalkData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  attachFormData() {
    this.LetsTalkSectionForm.patchValue({
      LetsTalkEmail: this.LetsTalkData.letsTalkEmail,
      CopyrightContent: this.LetsTalkData.copyrightContent,
      Comment: this.LetsTalkData.comment
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updateLetsTalkSection(){
    this.submitted = true;
    if (this.LetsTalkSectionForm.valid){
      let payload = {
        LetsTalkEmail: this.LetsTalkSectionForm.value.LetsTalkEmail,
        CopyrightContent: this.LetsTalkSectionForm.value.CopyrightContent,
        Comment: this.LetsTalkSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('FooterContent', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success("Your data update request has been submitted to admin for Review and Approval.");
          this.onCancel();
        }
      }, err => {
        console.log(err.error);
        if(err.error){
          this.toastMsg.error("Let's Talk Email and Copyright Data error");
        }
      });
    }
  }

  approveLetsTalkSection(event){
    let payload = {
      footerContentId: this.LetsTalkSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('FooterContent/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success("Let's Talk Email and Copyright Data approved successfully");
        }
        else if(event=='Rejected'){
          this.toastMsg.success("Let's Talk Email and Copyright Data rejected");
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error("Let's Talk Email and Copyright Data Approve error");
      }
    });
  }

}
