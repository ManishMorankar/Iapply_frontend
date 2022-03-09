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
  selector: 'app-faq-question-answer-section',
  templateUrl: './faq-question-answer-section.component.html',
  styleUrls: ['./faq-question-answer-section.component.scss']
})
export class FaqQuestionAnswerSectionComponent implements OnInit {
  Editor = ClassicEditor;
  FAQQuestionAnswerSectionForm: FormGroup
  iApplyUser;
  submitted: boolean = false;
  FAQQuestionAnswerSectionId: any;
  FAQQuestionAnswerData;
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
      this.FAQQuestionAnswerSectionId = params['id']
    )
    if (this.FAQQuestionAnswerSectionId){
      this.getFAQQuestionAnswerById();
    } else {
      this.getFAQQuestionAnswerData();
    }
    this.FAQQuestionAnswerSectionForm = this.formBuilder.group({
      Question: ['', Validators.required],
      Answer: ['', Validators.required],
      Comment: ['', Validators.required]
    });
  }
  get cuf() { return this.FAQQuestionAnswerSectionForm.controls; }

  getFAQQuestionAnswerData() {
    this.apiService.get('Faq/FaqQuestionAnswer').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.FAQQuestionAnswerData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
    });
  }

  getFAQQuestionAnswerById() {
    this.apiService.get('Faq/FaqQuestionAnswer/'+this.FAQQuestionAnswerSectionId).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.FAQQuestionAnswerData = data.result[0];
        this.attachFormData();
      }
    }, err => {
      console.log(err);
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

  attachFormData() {
    this.FAQQuestionAnswerSectionForm.patchValue({
      Question: this.FAQQuestionAnswerData.question,
      Answer: this.FAQQuestionAnswerData.answer,
      Comment: this.FAQQuestionAnswerData.comment
    });
  }

  onCancel(){
    this.router.navigate(['app/contentUpdate']);
  }

  updateFAQQuestionAnswerSection(){
    this.submitted = true;
    if (this.FAQQuestionAnswerSectionForm.valid){
      let payload = {
        Question: this.FAQQuestionAnswerSectionForm.value.Question,
        Answer: this.FAQQuestionAnswerSectionForm.value.Answer,
        Comment: this.FAQQuestionAnswerSectionForm.value.Comment,
        AddedBy: this.iApplyUser.userDetailsId
      }

      this.apiService.post('Faq/FaqQuestionAnswer', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.toastMsg.success('FAQ Question Answer Data added successfully');
          this.onCancel();
        }
      }, err => {
        console.log(err.error);
        if(err.error){
          this.toastMsg.error('FAQ Question Answer Data error');
        }
      });
    }
  }

  approveFAQQuestionAnswerSection(event){
    let payload = {
      faqQuestionAnswerId: this.FAQQuestionAnswerSectionId,
      Status: event,
      ModifiedBy: this.iApplyUser.userDetailsId
    }
    this.apiService.post('Faq/FaqQuestionAnswer/Approval', payload).subscribe(data => {
      if (data.statusCode === '201' && data.result){
        if(event=='Approved'){
          this.toastMsg.success('FAQ Question Answer Data approved successfully');
        }
        else if(event=='Rejected'){
          this.toastMsg.success('FAQ Question Answer Data rejected');
        }
        this.onCancel();
      }
    }, err => {
      console.log(err.error)
      if (err.error){
        this.toastMsg.error('FAQ Question Answer Data Approve error');
      }
    });
  }

}
