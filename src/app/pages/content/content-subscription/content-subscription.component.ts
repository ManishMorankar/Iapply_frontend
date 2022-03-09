import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-content-subscription',
  templateUrl: './content-subscription.component.html',
  styleUrls: ['./content-subscription.component.scss']
})
export class ContentSubscriptionComponent implements OnInit {
  subscriptionsData;
  subscriptionForm: FormGroup;
  submitted;
  iApplyUser;
  formData: FormData;
  SubscriptionId: any;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router:Router,
    private _sanitizer: DomSanitizer, private formBuilder: FormBuilder) { }

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
    this.getSubscriptions();
    this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
    this.subscriptionForm = this.formBuilder.group({
      PackageName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      Price: ['', [Validators.required]],
      Description: ['', Validators.required]
    });
  }

  get cuf() {
    return this.subscriptionForm.controls;
  }

  getSubscriptions() {
    this.apiService.get('CustomerSubscription').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.subscriptionsData = data.result;
        // console.log(this.subscriptionsData)
      }
    }, err => {
      console.log(err);
    });
  }

  resetSubscriptionForm(){
    this.subscriptionForm.reset();
    this.SubscriptionId = '';
  }

  editSubscription(row){
    this.SubscriptionId = row.subscriptionId;
    this.subscriptionForm.get('PackageName').setValue(row.packageName);
    this.subscriptionForm.get('Price').setValue(row.price);
    this.subscriptionForm.get('Description').setValue(row.description);
  }

  onSubmit() {
    this.submitted = true;
    if (this.subscriptionForm.valid) {
      if (this.SubscriptionId) {
        let payload = {
          "PackageName": this.subscriptionForm.value.PackageName,
          "Description": this.subscriptionForm.value.Description,
          "Price": this.subscriptionForm.value.Price,
          "ModifiedBy": this.iApplyUser.userDetailsId,
          "SubscriptionId": this.SubscriptionId,
        }
        this.apiService.put('CustomerSubscription', payload)
          .subscribe(data => {
            if (data.statusCode === "201" && data.result) {
              this.toastMsg.success('Subscription upated successfully');
              this.getSubscriptions();
            }
          });
      } else {
        let payload = {
          "PackageName": this.subscriptionForm.value.PackageName,
          "Description": this.subscriptionForm.value.Description,
          "Price": this.subscriptionForm.value.Price,
          "AddedBy": this.iApplyUser.userDetailsId,
        }
        this.apiService.post('CustomerSubscription', payload)
        .subscribe(data => {
          if (data.statusCode === "201" && data.result) {
            this.toastMsg.success('Your data update request has been submitted to admin for Review and Approval.');
            this.subscriptionForm.reset();
            this.getSubscriptions();
          }
        });
      }
    }
  }

  cancel() {
    this.subscriptionForm.reset();
  }

  exportToExcel(){

  }
}

