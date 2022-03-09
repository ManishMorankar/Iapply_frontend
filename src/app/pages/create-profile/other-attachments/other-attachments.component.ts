import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-other-attachments',
  templateUrl: './other-attachments.component.html',
  styleUrls: ['./other-attachments.component.scss']
})
export class OtherAttachmentsComponent implements OnInit {

  CustomerProfileId: 0;
  currentUser;
  otherAttachments:string [] = [];
  formData;
  submitted: boolean = false;
  personalProfile: any;
  getOtherAttachmentsData: any;
  uploadDocumentForm: FormGroup;
  CustomerDocumentId;
  resumeAttachments: string[] = [];
  uploadResumeForm: FormGroup;
  DocumentType: any;
  completedStep: any = 0;
  iApplyUser;
  SubscriptionCancel: boolean = false;
  PaymentInfo;
  hasChange: boolean = false;
  form: any;

  iconList = [ // array of icon class list based on type
    { type: "xlsx", icon: "fa fa-file-excel" },
    { type: "pdf", icon: "fa fa-file-pdf" },
    { type: "jpg", icon: "fa fa-file-image" },
    { type: "docx", icon: "fa fa-file-word-o" },
    { type: "png", icon: "fa fa-file-image" },
    { type: "csv", icon: "fa fa-file-csv" },
    { type: "txt", icon: "fa fa-file-text" },
    { type: "json", icon: "fa fa-file-text" },
  ];
  getResumeAttachmentData: any;
  deleteDocumentId: any;
  deleteType: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastMsg: ToastrService, private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    localStorage.setItem('formChanged','false');
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }
    if (localStorage.getItem("paymentInfo") != 'null') {
      this.PaymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
      if (this.PaymentInfo.subscriptionStatus == "Cancel") {
        this.SubscriptionCancel = true;
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
    this.getAllData()
    this.uploadDocumentForm = this.formBuilder.group({
      UploadDocument: ['']
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.CustomerProfileId = params['CustomerProfileId'];
      // console.log(this.CustomerProfileId);
    });
    if (this.CustomerProfileId == 0 || this.CustomerProfileId == undefined) {
      this.getPersonalProfile();
    }
  }


  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
        .subscribe(data => {
          if (data.statusCode === '201' && data.result) {
            this.personalProfile = data.result;
            this.CustomerProfileId =  this.personalProfile.customerProfileId;
          }
        })
  }

  selectFile(event){
    if(event.target.files.length===0){
      return;
    }
    for(var i=0;i<event.target.files.length;i++){
      this.DocumentType="Attachment";
      this.otherAttachments.push(event.target.files[i]);
    }
    console.log(this.otherAttachments);
    console.log(this.uploadDocumentForm.value);
  }

  removeFile(document)
  {
    this.otherAttachments.splice(document, 1);
    // this.uploadDocumentForm.reset();
  }

  deleteModal(id, type){
      this.deleteDocumentId = id;
      this.deleteType = type;
      $('#deleteExperince').modal('show');
  }
  deleteItemFunc(){
    if(this.deleteType == 'delete'){
        this.deleteFile(this.deleteDocumentId);
    }
    if(this.deleteType == 'remove'){
        this.removeFile(this.deleteDocumentId);
    }
    if(this.deleteType == 'resume'){
      this.removeResumeFile(this.deleteDocumentId);
  }
    $('#deleteExperince').modal('hide');
  }

  selectResumeFile(event) {
      this.getResumeAttachmentData=[];
      this.resumeAttachments = [];
      this.resumeAttachments.push(event.target.files[0]);
  }

  removeResumeFile(resumedocument) {
    this.resumeAttachments.splice(resumedocument, 1);
    this.resumeAttachments = [];
    // this.uploadDocumentForm.reset();
  }

  getFileExtension(document) { // this will give you icon class name
    let ext = document.split(".").pop();
    let obj = this.iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      let icon = obj[0].icon;
      return icon;
    } else {
      return "";
    }
  }
  getFileExtensionResume(resumedocument) { // this will give you icon class name
    let ext = resumedocument.split(".").pop();
    let obj = this.iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      let icon = obj[0].icon;
      return icon;
    } else {
      return "";
    }
  }
  onBack(){
    this.router.navigate(['customer/job-preference'], { queryParams: { CustomerProfileId: this.CustomerProfileId } });
    localStorage.setItem('current-step', "6");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 6) {
      localStorage.setItem('completed-steps', "6");
    }
  }
  getAllData(){
    this.apiService.get('CustomerProfile/Attachment/' + this.currentUser.customerId)
    .subscribe(data => {
      if (data) {

        this.getOtherAttachmentsData = data.result;
        this.getResumeAttachmentData = data.result;

      }
    })
  }
  getFileName(docPath) {
    var result = docPath.split('\\');
    return result[result.length-1]
  }
  deleteFile(customerDocumentId){
   this.CustomerDocumentId = customerDocumentId
    this.apiService.delete('CustomerProfile/DeleteAttachment/'+this.CustomerDocumentId)
    .subscribe(data => {
    if (data.statusCode === "201" && data.result) {
      this.toastMsg.success('Documents deleted successfully');
      this.getAllData();
    }
  });
  }
  onNext(command){
    this.submitted = true;
    console.log(this.uploadDocumentForm.value);
    this.formData = new FormData();
        this.formData.append('CustomerProfileId', this.CustomerProfileId);
        this.formData.append('AddedBy', this.currentUser.customerId);
        this.formData.append('DocumentType', this.DocumentType);
        for(let i=0;i<this.otherAttachments.length;i++)
        {
          this.formData.append('OtherAttachments', this.otherAttachments[i]);
        }
        if(this.resumeAttachments.length > 0){

        for(let i=0;i<this.resumeAttachments.length;i++)
        {
          this.formData.append('ResumeAttachment', this.resumeAttachments[i]);
        }
      }

        this.apiService.post('CustomerProfile/Document', this.formData)
        .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          var CustomerProfileId=data.result.customerProfileId;
          this.toastMsg.success('Documents uploaded successfully');
          localStorage.setItem('current-step', "8");
          this.completedStep = localStorage.getItem('completed-steps');
          if (this.completedStep < 8) {
            localStorage.setItem('completed-steps', "7");
          }
          if (command == "Continue") {
            this.router.navigate(['customer/review'], { queryParams: { CustomerProfileId: CustomerProfileId } });
          }
          else {
            this.otherAttachments = [];
            this.getAllData();
          }
        }
      });
  }


}
