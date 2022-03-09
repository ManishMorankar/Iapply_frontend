import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-jobconfiguration',
  templateUrl: './jobconfiguration.component.html',
  styleUrls: ['./jobconfiguration.component.scss']
})
export class JobconfigurationComponent implements OnInit {
  JobConfigurationMasterForm: FormGroup;
  JobDetailsForm: FormGroup;
  IPAddressForm: FormGroup;
  JobTitle: any;
  JobLocation: any;
  iApplyUser: any;
  JobDetails;
  JobId;
  submitted;
  SubscriberMasterData: any;
  SubscriberMasterDetails: any;
  TempSubscriberMasterDetails: any;
  TempJobDetails: any;
  Content: any;
  Type: any;
  Status: any;
  AddedBy: any;
  filterForm: FormGroup;
  temp: any[];
  IpAddressDetails: any;
  RestrictedIPAddressId: any;
  IPAddress: any;
  constructor(private formBuilder: FormBuilder,private apiService: ApiService, private router: Router , private toastMsg: ToastrService, private activatedRoute: ActivatedRoute) { }

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
    this.JobConfigurationMasterForm = this.formBuilder.group({
      JobTitle: ['', [Validators.required]],
      JobLocation: ['', [Validators.required]]
    });

    this.JobDetailsForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      Skills: ['', [Validators.required]],
      Description: ['', [Validators.required]]
    });
    this.IPAddressForm = this.formBuilder.group({
      IPAddress: ['', [Validators.required]]
    });
    this.filterForm = this.formBuilder.group({
      Type: [''],
     Status:['']
    });
   this.getSubscriberMaster();
   this.getJobTitleandSkills();
   this.getIpAddress();
  }
  getSubscriberMaster() {
    this.apiService.get('CustomerProfile/GetSubscriberMaster').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.SubscriberMasterDetails = data.result;
      }
    }, err => {
      console.log(err);
    });
  }
  attachFormData() {
    this.JobConfigurationMasterForm.patchValue({
      LogoTitle: this.SubscriberMasterData .logoTitle,
      LogoDescription: this.SubscriberMasterData .logoDescription,
    });
  }
  get cuf() {
    return this.JobDetailsForm.controls;
   }
   get pSubmitted() {
    return this.JobConfigurationMasterForm.controls;
   }
   onSubmit(){
    this.submitted = true;
    console.log(this.JobConfigurationMasterForm.value);
    if (this.JobConfigurationMasterForm.valid) {
      let payload= {
        jobTitle_Allow: this.JobConfigurationMasterForm.value.JobTitle,
        jobLocation_Allow: this.JobConfigurationMasterForm.value.JobLocation,
        Status: "Approved",
        AddedBy: this.iApplyUser.userDetailsId
     }
        this.apiService.post('CustomerProfile/SubscriberMaster',payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('JobTitle and JobLocation update Successfully');
            this.JobConfigurationMasterForm.reset();
          }
        }, error => {
          console.log(error)
          if (error){
            this.toastMsg.error('JobTitle and JobLocation updation Error');
          }
        });

      }
    }
    getJobTitleandSkills() {
      this.apiService.get('CustomerProfile/GetJobTitleAndSkill').subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.JobDetails = data.result;
          this.temp = [...data.result];
          this.TempJobDetails = this.JobDetails;
          // for (var i = 0; i < this.PaymentHistoryDetails.length; i++) {
          //   this.PlanList.push(this.PaymentHistoryDetails[i].plan);
          //   this.PaymentMethodList.push(this.PaymentHistoryDetails[i].paymentMethod);
          //   this.PaymentStatusList.push(this.PaymentHistoryDetails[i].paymentStatus);
          // }
          // this.PlanList = this.PlanList.filter((v, i, a) => a.indexOf(v) === i);
          // this.PaymentMethodList = this.PaymentMethodList.filter((v, i, a) => a.indexOf(v) === i);
          // this.PaymentStatusList = this.PaymentStatusList.filter((v, i, a) => a.indexOf(v) === i);
        }
      }, err => {
        console.log(err);
      });
    }

    onAccept(row)
    {
      this.submitted = true;
        let payload= {
          Type:row.type,
          Content:row.content,
          Status: "Approved",
          AddedBy: this.iApplyUser.userDetailsId
       }
          this.apiService.post('CustomerProfile/UpdateJobTitleSkill',payload).subscribe(data => {
            if (data.statusCode === '201' && data.result){
              this.toastMsg.success('Data Accept Successfully');
            }
          }, error => {
            console.log(error)
            if (error){
              this.toastMsg.error('Data updation Error');
            }
          });


    }
    onReject(row)
    {
      this.submitted = true;
        let payload= {
          Type:row.type,
          Content:row.content,
          Status: "Rejected",
          AddedBy: this.iApplyUser.userDetailsId
       }
          this.apiService.post('CustomerProfile/UpdateJobTitleSkill',payload).subscribe(data => {
            if (data.statusCode === '201' && data.result){
              this.toastMsg.success('Data Reject Successfully');
            }
          }, error => {
            console.log(error)
            if (error){
              this.toastMsg.error('Data Reject Error');
            }
          });


    }

    getIpAddress()
    {
      this.apiService.get('jobs/RestrictedIpAddress/List').subscribe(data => {
        if (data.statusCode === '201' && data.result){
          this.IpAddressDetails = data.result;
          for(var i=0 ;i<data.result.length;i++)
          {
            this.IPAddress=data.result[i].ipAddress;
            this.RestrictedIPAddressId=data.result[i].restrictedIpAddressId;
          }
        }
      }, err => {
        console.log(err);
      });
    }
    DeleteIPAddressDetails(data) {
      this.apiService.delete('jobs/RestrictedIpAddress/Delete/' +data.restrictedIpAddressId)
      .subscribe(data => {if (data.statusCode === "201" && data.result) {
        this.toastMsg.success('IPAddress has been deleted successfully');
       this.getIpAddress();
        }
      })
    }
    onSubmitIpAddress()
    {
      this.submitted = true;
      console.log(this.IPAddressForm.value);
      if (this.IPAddressForm.valid) {
        let payload= {
          IpAddress: this.IPAddressForm.value.IPAddress,
       }
          this.apiService.post('jobs/RestrictedIpAddress/Add',payload).subscribe(data => {
            if (data.statusCode === '201' && data.result){
              this.toastMsg.success('New IpAddress Added Successfully');
              this.IPAddressForm.reset();
              this.getIpAddress();
            }
          }, error => {
            console.log(error)
            if (error){
              this.toastMsg.error('IPAddress cannot be added');
            }
          });

        }
    }
   resetForm(){
    this.JobConfigurationMasterForm.reset();
  }


  AddNewJobTitleandSkills()
  {
    this.router.navigate(['app/NewJobTitleandSkills']);
  }

  AddSearchJobTitleandSkills(row)
  {
    this.Type=row.type,
    this.Content=row.content,
    this.Status= "Rejected",
    this.AddedBy= this.iApplyUser.userDetailsId
    var renInfo= {Type: row.type, Content: row.content }
    this.router.navigate(['app/SearchandAddNewJobTitleandSkills'], { queryParams: renInfo});
  }

  searchFilter()
  {
    if ((this.filterForm.controls.Status.value != null || this.filterForm.controls.Status.value != "" || this.filterForm.controls.Status.value != "All") && (this.filterForm.controls.Type.value == null || this.filterForm.controls.Type.value == "" || this.filterForm.controls.Type.value == "All") ) {
      var filter_array = this.JobDetails.filter(x => x.status == this.filterForm.controls.Status.value);
      this.TempJobDetails = filter_array;
      if(filter_array.length==0)
      {
       this.JobDetails= this.JobDetails;
      }
      else{
        this.TempJobDetails = [...this.TempJobDetails];
      }
    }
   else if ((this.filterForm.controls.Status.value == null || this.filterForm.controls.Status.value == "" || this.filterForm.controls.Status.value == "All") && (this.filterForm.controls.Type.value != null || this.filterForm.controls.Type.value != "" || this.filterForm.controls.Type.value != "All") ) {
      var filter_array = this.JobDetails.filter(x => x.type == this.filterForm.controls.Type.value);
      this.TempJobDetails = filter_array;
      this.TempJobDetails = filter_array;
      if(filter_array.length==0)
      {
       this.JobDetails= this.JobDetails;
      }
      else{
        this.TempJobDetails = [...this.TempJobDetails];
      }

   }

   else if ((this.filterForm.controls.Status.value != null && this.filterForm.controls.Status.value != "" && this.filterForm.controls.Status.value == "All") && (this.filterForm.controls.Type.value != null && this.filterForm.controls.Type.value != "" && this.filterForm.controls.Type.value == "All") ) {
    this.TempJobDetails = this.JobDetails;
    this.TempJobDetails = [...this.TempJobDetails];
 }
 else if ((this.filterForm.controls.Status.value != null && this.filterForm.controls.Status.value != "" && this.filterForm.controls.Status.value != "All") && (this.filterForm.controls.Type.value != null && this.filterForm.controls.Type.value != "" && this.filterForm.controls.Type.value != "All") ) {
  var filter_array = this.JobDetails.filter(x => x.type == this.filterForm.controls.Type.value && x.status == this.filterForm.controls.Status.value);
  this.TempJobDetails = filter_array;
  this.TempJobDetails = [...this.TempJobDetails];
}
  }
  clearFilter() {
    this.filterForm.reset();
    this.TempJobDetails = this.JobDetails;
    this.TempJobDetails = [...this.JobDetails];
  }
}
