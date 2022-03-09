import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../service/api.service';
import { ExcelService } from '../../service/excel.service';
import { DataService } from '../../service/data.service';
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  filterForm: FormGroup;
  iApplyUser;
  customerId: any;
  temp;
  currentUser;
  PaymentHistoryDetails;
  TempPaymentHistoryDetails;
  PlanList: any = [];
  PaymentMethodList: any = [];
  PaymentStatusList: any = [];
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  loginUser: any;
  paymentstatus;


  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private excelService: ExcelService, private data: DataService) { }

  ngOnInit(): void {
    $("#SubscriptionEndDateValue").empty();
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


    this.filterForm = this.formBuilder.group({
      Plan:[''],
      PaymentMethod: [''],
      PaymentStatus: [''],
      FromDate: [''],
      ToDate: [''],
    });
    if (localStorage.getItem("iApplyUser") != 'null') {
      this.iApplyUser= JSON.parse(localStorage.getItem("iApplyUser"));
      this.customerId=this.iApplyUser.customerId;
    }
    this.getPaymentHistoryDetails();
  }
  getPaymentHistoryDetails()
  {
    this.apiService.get('CustomerProfile/PaymentHistory/'+ this.customerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        this.PaymentHistoryDetails = data.result;
        this.paymentstatus=this.PaymentHistoryDetails[0].paymentStatus;
        $(".SubscriptionEndDateValue").hide();
        this.temp = [...data.result];
        this.TempPaymentHistoryDetails = this.PaymentHistoryDetails
        for (var i = 0; i < this.TempPaymentHistoryDetails.length; i++) {
        if(this.TempPaymentHistoryDetails[i].paymentStatus == "Failed")
        {
          this.TempPaymentHistoryDetails[i].subscriptionEndDate = "NULL";
        }
        }
        for (var i = 0; i < this.TempPaymentHistoryDetails.length; i++) {
          if(this.TempPaymentHistoryDetails[i].subscriptionStatus == "Past-Active")
          {
          if(this.TempPaymentHistoryDetails.length >= 2)
          {
          if(this.TempPaymentHistoryDetails[i].subscriptionStatus == 'Past-Active' && this.TempPaymentHistoryDetails[i].plan == 'Basic')
                {
                this.TempPaymentHistoryDetails[i].remainingDays = "Upgrade";
                }
                if(this.TempPaymentHistoryDetails[i].subscriptionStatus == 'Past-Active' && this.TempPaymentHistoryDetails[i].plan == 'Standard')
                {
                this.TempPaymentHistoryDetails[i].remainingDays = "Downgrade";
                }
          }
          }
        }
        for (var i = 0; i < this.PaymentHistoryDetails.length; i++) {

          this.PlanList.push(this.PaymentHistoryDetails[i].plan);
          this.PaymentMethodList.push(this.PaymentHistoryDetails[i].paymentMethod);
          this.PaymentStatusList.push(this.PaymentHistoryDetails[i].paymentStatus);

        }
        this.PlanList = this.PlanList.filter((v, i, a) => a.indexOf(v) === i);
        this.PaymentMethodList = this.PaymentMethodList.filter((v, i, a) => a.indexOf(v) === i);
        this.PaymentStatusList = this.PaymentStatusList.filter((v, i, a) => a.indexOf(v) === i);
      }
    })
  }
  searchFilter() {
    if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All") && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.subscriptionEndDate >= this.filterForm.controls.FromDate.value && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All") && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.subscriptionEndDate == this.filterForm.controls.FromDate.value && x.subscriptionEndDate == this.filterForm.controls.ToDate.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All")  && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.subscriptionEndDate >= this.filterForm.controls.FromDate.value && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value && x.plan == this.filterForm.controls.Plan.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null || this.filterForm.controls.PaymentMethod.value != "") && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.subscriptionEndDate >= this.filterForm.controls.FromDate.value && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails  = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != ""  && this.filterForm.controls.FromDate.value != "All") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "") && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.subscriptionEndDate == this.filterForm.controls.FromDate.value);
      this.TempPaymentHistoryDetails  = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }

    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null || this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "") && (this.filterForm.controls.PaymentStatus.value != null || this.filterForm.controls.PaymentStatus.value != "" || this.filterForm.controls.PaymentStatus.value != "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.subscriptionEndDate >= this.filterForm.controls.FromDate.value && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails  = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }

    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null || this.filterForm.controls.Plan.value != "" || this.filterForm.controls.Plan.value != "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All") && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value);
       this.TempPaymentHistoryDetails = filter_array;
       if(filter_array.length==0)
       {
        this.TempPaymentHistoryDetails = this.PaymentHistoryDetails;
       }
       else{
        this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
       }

     }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null || this.filterForm.controls.PaymentMethod.value != "" || this.filterForm.controls.PaymentMethod.value != "All") && (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
     var filter_array = this.PaymentHistoryDetails.filter(x => x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = filter_array;
      if(filter_array.length==0)
      {
       this.TempPaymentHistoryDetails = this.PaymentHistoryDetails;
      }
      else{
       this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
      }
    }

    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All") && (this.filterForm.controls.PaymentStatus.value != null || this.filterForm.controls.PaymentStatus.value != "" || this.filterForm.controls.PaymentStatus.value != "All")) {
     var filter_array = this.PaymentHistoryDetails.filter(x => x.paymentStatus == this.filterForm.controls.PaymentStatus.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = filter_array;
      if(filter_array.length==0)
      {
       this.TempPaymentHistoryDetails = this.PaymentHistoryDetails;
      }
      else{
       this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
      }
    }

    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" &&  this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value != "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value != "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value != "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value != "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value != "All")&& (this.filterForm.controls.PaymentStatus.value == null || this.filterForm.controls.PaymentStatus.value == "" || this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x =>x.subscriptionEndDate == this.filterForm.controls.FromDate.value && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value&& x.paymentStatus == this.filterForm.controls.PaymentStatus.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value != "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value != "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x =>x.subscriptionEndDate >= this.filterForm.controls.FromDate.value  && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }

    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.paymentStatus == this.filterForm.controls.PaymentStatus.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value == null || this.filterForm.controls.Plan.value == "" || this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value != "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value != "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.paymentStatus == this.filterForm.controls.PaymentStatus.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }

    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value == "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value == null || this.filterForm.controls.FromDate.value == "") && (this.filterForm.controls.ToDate.value == null || this.filterForm.controls.ToDate.value == "") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value != "All") && (this.filterForm.controls.PaymentMethod.value == null || this.filterForm.controls.PaymentMethod.value == "" || this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value != null || this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value != "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x => x.plan == this.filterForm.controls.Plan.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }

    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "" && this.filterForm.controls.FromDate.value == "All") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "" && this.filterForm.controls.ToDate.value == "All") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value == "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value == "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value == "All")) {
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }
    else if ((this.filterForm.controls.FromDate.value != null && this.filterForm.controls.FromDate.value != "" && this.filterForm.controls.FromDate.value != "All") && (this.filterForm.controls.ToDate.value != null && this.filterForm.controls.ToDate.value != "" && this.filterForm.controls.ToDate.value != "All") && (this.filterForm.controls.Plan.value != null && this.filterForm.controls.Plan.value != "" && this.filterForm.controls.Plan.value != "All") && (this.filterForm.controls.PaymentMethod.value != null && this.filterForm.controls.PaymentMethod.value != "" && this.filterForm.controls.PaymentMethod.value != "All")&& (this.filterForm.controls.PaymentStatus.value != null && this.filterForm.controls.PaymentStatus.value != "" && this.filterForm.controls.PaymentStatus.value != "All")) {
      var filter_array = this.PaymentHistoryDetails.filter(x =>  x.subscriptionEndDate >= this.filterForm.controls.FromDate.value && x.subscriptionEndDate <= this.filterForm.controls.ToDate.value && x.plan == this.filterForm.controls.Plan.value && x.paymentMethod == this.filterForm.controls.PaymentMethod.value && x.paymentStatus == this.filterForm.controls.PaymentStatus.value);
      this.TempPaymentHistoryDetails = filter_array;
      this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
    }

  }



  clearFilter() {
    this.filterForm.reset();
    this.TempPaymentHistoryDetails = this.PaymentHistoryDetails;
    this.TempPaymentHistoryDetails = [...this.TempPaymentHistoryDetails];
  }
  exportData() {
    this.excelService.exportAsExcelFile(this.TempPaymentHistoryDetails, 'export-to-excel');
  }
  addPayment()
  {
    this.router.navigate(['app/add-Payment-History']);
  }
}
