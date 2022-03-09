import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../service/api.service';
import { ExcelService } from '../../service/excel.service';
import { DataService } from '../../service/data.service';


@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent implements OnInit {
  filterForm: FormGroup;
  JobHistoryDetails: any = [];
  TempJobHistoryDetails: any = [];
  CountryList: any = [];
  JobTitleList: any = [];
  temp;
  currentUser;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  loginUser: any;
  iApplyUser;
  customerId: any;
  paymentStatus: any;
  status: any;
  paymentInfo: any;
  paymentMethod: any;
  subscriptionStatus: any;
  SubscrptionExpireDate;
  SubscriptionStartDate;
  TempSubscrptionExpireDate;
  TempSubscriptionStartDate;
  JobAppliedDaily;
  JobAppliedWeekly;
  JobAppliedMonthly;
  DashboardDetailsResult: any;
  SubscrptionPlan: any;
  JobDescriptionData: any;
  JobDescriptionurl: any;
  BasicJobHistoryDetails: any;
  PaymentHistoryDetails: any;
  SubscrptionPlanName: any;
  paymentStatusvalue: any;
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private excelService: ExcelService, private data: DataService) { }

  ngOnInit(): void {
    this.data.changeMessage("in-active");
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
      this.paymentInfo= JSON.parse(localStorage.getItem("paymentInfo"));
      this.paymentMethod=this.paymentInfo.paymentMethod;
      this.paymentStatus=this.paymentInfo.paymentStatus;
      this.status=this.paymentInfo.status;
      this.subscriptionStatus=this.paymentInfo.subscriptionStatus;

    }
    if (localStorage.getItem("DashboardDetailsResult")) {
      this.DashboardDetailsResult= JSON.parse(localStorage.getItem("DashboardDetailsResult"));
      this.SubscrptionPlan=this.DashboardDetailsResult.subscrptionPlan;
      this.SubscrptionExpireDate = this.DashboardDetailsResult.subscrptionExpireDate;
      this.SubscriptionStartDate = this.DashboardDetailsResult.subscrptionStartDate;
      this.TempSubscriptionStartDate = new Date(this.SubscriptionStartDate)
      this.SubscrptionExpireDate =this.DashboardDetailsResult.subscrptionExpireDate;
      this.TempSubscrptionExpireDate = new Date(this.SubscrptionExpireDate)
      this.SubscrptionExpireDate =this.DashboardDetailsResult.subscrptionExpireDate;
      this.JobAppliedDaily = this.DashboardDetailsResult.jobAppliedDaily;
      this.JobAppliedWeekly = this.DashboardDetailsResult.jobAppliedWeekly;
      this.JobAppliedMonthly = this.DashboardDetailsResult.jobAppliedMonthly;
}
    this.filterForm = this.formBuilder.group({
      Country:[''],
      JobTitle: [''],
      FromDate: [''],
      ToDate: [''],
    });

    if (localStorage.getItem("iApplyUser") != 'null') {
      this.iApplyUser= JSON.parse(localStorage.getItem("iApplyUser"));
      this.customerId=this.iApplyUser.customerId;
    }
    this.getJobAppliedHistoryDetails();
  }
  getJobAppliedHistoryDetails() {
    this.apiService.get('CustomerProfile/JobAppliedHistory/' + this.customerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        this.JobHistoryDetails = data.result;
        this.TempJobHistoryDetails = this.JobHistoryDetails;
        for (var i = 0; i < this.JobHistoryDetails.length; i++) {
          this.CountryList.push(this.JobHistoryDetails[i].countryCode);
          this.JobTitleList.push(this.JobHistoryDetails[i].jobTitle);
        }
        this.CountryList = this.CountryList.filter((v, i, a) => a.indexOf(v) === i);
        this.JobTitleList = this.JobTitleList.filter((v, i, a) => a.indexOf(v) === i);
      }
    })
  }
  searchFilter() {
    if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Country.value == null || this.filterForm.controls.Country.value == "" || this.filterForm.controls.Country.value == "All") && (this.filterForm.controls.JobTitle.value == null || this.filterForm.controls.JobTitle.value == "" || this.filterForm.controls.JobTitle.value == "All")) {
      var filter_array = this.JobHistoryDetails.filter(x => x.jobAppliedDate >= this.filterForm.controls.FromDate.value && x.jobAppliedDate <= this.filterForm.controls.ToDate.value);
      this.TempJobHistoryDetails = filter_array;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Country.value != null && this.filterForm.controls.Country.value != "") && (this.filterForm.controls.JobTitle.value == null || this.filterForm.controls.JobTitle.value == "" || this.filterForm.controls.JobTitle.value == "All")) {
      var filter_array = this.JobHistoryDetails.filter(x => x.jobAppliedDate >= this.filterForm.controls.FromDate.value && x.jobAppliedDate <= this.filterForm.controls.ToDate.value && x.countryCode == this.filterForm.controls.Country.value);
      this.TempJobHistoryDetails = filter_array;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Country.value == null || this.filterForm.controls.Country.value == "" || this.filterForm.controls.Country.value == "All") && (this.filterForm.controls.JobTitle.value != null || this.filterForm.controls.JobTitle.value != "")) {
      var filter_array = this.JobHistoryDetails.filter(x => x.jobAppliedDate >= this.filterForm.controls.FromDate.value && x.jobAppliedDate <= this.filterForm.controls.ToDate.value && x.jobTitle == this.filterForm.controls.JobTitle.value);
      this.TempJobHistoryDetails = filter_array;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Country.value != null || this.filterForm.controls.Country.value != "" || this.filterForm.controls.Country.value != "All" )&& (this.filterForm.controls.JobTitle.value == null || this.filterForm.controls.JobTitle.value == "" || this.filterForm.controls.JobTitle.value == "All")) {
      var filter_array = this.JobHistoryDetails.filter(x => x.countryCode == this.filterForm.controls.Country.value);
      this.TempJobHistoryDetails = filter_array;
      if(filter_array.length==0)
      {
       this.TempJobHistoryDetails = this.JobHistoryDetails;
      }
      else{
       this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
      }

    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Country.value == null || this.filterForm.controls.Country.value == "" || this.filterForm.controls.Country.value == "All") && (this.filterForm.controls.JobTitle.value != null || this.filterForm.controls.JobTitle.value != "" || this.filterForm.controls.JobTitle.value != "All")) {
      var filter_array = this.JobHistoryDetails.filter(x => x.jobTitle == this.filterForm.controls.JobTitle.value);
      this.TempJobHistoryDetails = filter_array;
      if(filter_array.length==0)
      {
       this.TempJobHistoryDetails = this.JobHistoryDetails;
      }
      else{
       this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
      }

    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Country.value != null && this.filterForm.controls.Country.value != "" && this.filterForm.controls.Country.value == "All") && (this.filterForm.controls.JobTitle.value != null && this.filterForm.controls.JobTitle.value != "" && this.filterForm.controls.JobTitle.value == "All")) {
      this.TempJobHistoryDetails = this.JobHistoryDetails;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Country.value != null && this.filterForm.controls.Country.value != "" && this.filterForm.controls.Country.value != "All") && (this.filterForm.controls.JobTitle.value != null && this.filterForm.controls.JobTitle.value != "" && this.filterForm.controls.JobTitle.value != "All")) {
      var filter_array = this.JobHistoryDetails.filter(x => x.countryCode == this.filterForm.controls.Country.value && x.jobTitle == this.filterForm.controls.JobTitle.value);
      this.TempJobHistoryDetails = filter_array;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }

    else if ((this.filterForm.controls.FromDate.value == null && this.filterForm.controls.FromDate.value != "" && this.filterForm.controls.FromDate.value == "All") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "" && this.filterForm.controls.ToDate.value == "All") && (this.filterForm.controls.Country.value != null && this.filterForm.controls.Country.value != "" && this.filterForm.controls.Country.value == "All") && (this.filterForm.controls.JobTitle.value != null && this.filterForm.controls.JobTitle.value != "" && this.filterForm.controls.JobTitle.value == "All")) {
      this.TempJobHistoryDetails = this.JobHistoryDetails;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "" && this.filterForm.controls.FromDate.value != "All") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "" && this.filterForm.controls.ToDate.value != "All") && (this.filterForm.controls.Country.value != null && this.filterForm.controls.Country.value != "" && this.filterForm.controls.Country.value != "All") && (this.filterForm.controls.JobTitle.value != null && this.filterForm.controls.JobTitle.value != "" && this.filterForm.controls.JobTitle.value != "All")) {
      var filter_array = this.JobHistoryDetails.filter(x =>x.jobAppliedDate >= this.filterForm.controls.FromDate.value && x.jobAppliedDate <= this.filterForm.controls.ToDate.value && x.countryCode == this.filterForm.controls.Country.value && x.jobTitle == this.filterForm.controls.JobTitle.value);
      this.TempJobHistoryDetails = filter_array;
      this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
    }
  }
  clearFilter() {
    this.filterForm.reset();
    this.TempJobHistoryDetails = this.JobHistoryDetails;
    this.TempJobHistoryDetails = [...this.TempJobHistoryDetails];
  }
  exportData() {
    if (this.SubscrptionPlan == "Standard") {
      this.excelService.exportAsExcelFile(this.TempJobHistoryDetails, 'export-to-excel');
    }
    if (this.SubscrptionPlan == "Basic") {
      this.BasicJobHistoryDetails = [];
      for (let index = 0; index < this.TempJobHistoryDetails.length; index++) {
        const record = this.TempJobHistoryDetails[index];
        this.BasicJobHistoryDetails.push({ "countryCode": record.countryCode, "companyName": record.companyName, "jobTitle": record.jobTitle, "jobAppliedDate": record.jobAppliedDate })
      }
      this.excelService.exportAsExcelFile(this.BasicJobHistoryDetails, 'export-to-excel');
    }
  }
  getPaymentHistoryDetails()
  {
    this.apiService.get('CustomerProfile/PaymentHistory/'+ this.customerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        this.PaymentHistoryDetails = data.result;
        for (var i = 0; i <  this.PaymentHistoryDetails.length; i++) {
         this.SubscrptionPlanName=this.PaymentHistoryDetails[i].plan;
         this.paymentStatusvalue=this.PaymentHistoryDetails[i].paymentStatus;
        }
      }
    })
  }
  getJobDescription(row){
    console.log(row);
    this.JobDescriptionData=row.description;
    this.JobDescriptionurl=row.url;
  }

}
