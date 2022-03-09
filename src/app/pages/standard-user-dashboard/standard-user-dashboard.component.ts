import {Component, ViewChild, ElementRef, ViewEncapsulation, OnInit} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import mock from './mock';
import { StandardUserDashboardService } from './standard-user-dashboard.service'
import { ApiService } from '../../service/api.service';
import {  FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {  Router } from '@angular/router';
import { single } from './data';
import { ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from '../../service/data.service';
import { PaymentService } from '../../service/payment.service';
declare let jQuery: any;
declare var $: any;
declare var CircleProgress:any;
declare const window: any;
@Component({
  selector: 'app-standard-user-dashboard',
  templateUrl: './standard-user-dashboard.component.html',
  styleUrls: ['./standard-user-dashboard.component.scss']
})
export class StandardUserDashboardComponent implements OnInit {

  now = new Date();
  month = this.now.getMonth() + 1;
  year = this.now.getFullYear();
  mock = mock;

  calendarEvents: Array<Array<any>> = [
    [
      '2/' + this.month + '/' + this.year,
      'The flower bed',
      '#',
      '#5d8fc2',
      'Contents here'
    ],
    [
      '5/' + this.month + '/' + this.year,
      'Stop world water pollution',
      '#',
      '#f0b518',
      'Have a kick off meeting with .inc company'
    ],
    [
      '18/' + this.month + '/' + this.year,
      'Light Blue 2.2 release',
      '#',
      '#64bd63',
      'Some contents here'
    ],
    [
      '29/' + this.month + '/' + this.year,
      'A link',
      'http://www.flatlogic.com',
      '#dd5826',
    ]
  ];

  @ViewChild('chartContainer', {static: true}) chartContainer: ElementRef;
  @ViewChild('chartLegend', {static: true}) chartLegend: ElementRef;

  trends: Array<any> = [
    {
      gradient: '#ffc247',
    },
    {
      gradient: '#9964e3',
    },
    {
      gradient: '#3abf94',
    }
  ];
  formData: FormData;
  paymentStatus: any;
  status: any;
  paymentInfo: any;
  paymentMethod: any;
  subscriptionStatus: any;

  tidioChatApi:any;
  single: any[];
  view: any[] = [700, 300];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: [ '#FFA101','#304893', '#2CBF8C', '#633fe4'    ]
  };
  DashboardDetailsResult: any;
  JobDescriptionData: any;
  JobDescriptionUrl: any;
  JobDescriptionurl: any;
  RenewPackagePrice: any;
  PaymentHistoryDetails: any;
  paymentStatusvalue: any;
  SubscrptionPlanName: any;

  constructor(public standarduserdashboardService: StandardUserDashboardService, private apiService: ApiService, private router: Router, private _sanitizer: DomSanitizer, private formBuilder: FormBuilder, private toastMsg: ToastrService, private elementRef: ElementRef, private data: DataService, private pService: PaymentService) {

    Object.assign(this, { single });

    this.trends.map(t => {
      t.data = this.getRandomData();
    });

    this. standarduserdashboardService.onReceiveDataSuccess.subscribe(event => {
      if (event) {

      }
    });
  }

  getRandomData() {
    const arr = [];

    for (let i = 0; i < 25; i += 1) {
      arr.push(+Math.random().toFixed(1) * 10);
    }
    return arr;
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  temp;
  currentUser;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  loginUser: any;
  iApplyUser;
  customerId: any;

  ProfileStrength;
  MonthlyPlanRemainingDays;
  CurrentMonthJobApplied;
  TotalJobApplied;
  SubscrptionPlan;
  PackagePrice;
  SubscrptionExpireDate;
  SubscriptionStartDate;
  TempSubscrptionExpireDate;
  TempSubscriptionStartDate;
  JobAppliedDaily;
  JobAppliedWeekly;
  JobAppliedMonthly;
  JobsAppliedByCountry: any;
  SelectedPreferredCountries: any;
  JobHistoryDetails: any = [];
  OfflinePaymentReceipt: string [] = [];
  offlinePaymentReceiptData: any;
  PackageContentId;
  PackageRenew;
  notEligibleForPlanChange: boolean;
  ngOnInit() {


    this.data.changeMessage("in-active");

    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      this.customerId = this.iApplyUser.customerId;
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }
   /* if (localStorage.getItem("paymentInfo") != 'null') {
      this.paymentInfo= JSON.parse(localStorage.getItem("paymentInfo"));
      this.paymentMethod=this.paymentInfo.paymentMethod;
      this.paymentStatus=this.paymentInfo.paymentStatus;
      this.status=this.paymentInfo.status;
      this.subscriptionStatus=this.paymentInfo.subscriptionStatus;

    }*/
    this.paymentMethod = localStorage.getItem("Pay_Method");
    this.paymentStatus = localStorage.getItem("Pay_Status");
    this.status = localStorage.getItem("Pay_Status");
    this.subscriptionStatus = localStorage.getItem("Sub_Status");
    this.pService.changeMessage(this.subscriptionStatus);

    this.getDashboardDetails();
    this.getUpgradeChanges();
    this.getJobAppliedHistoryDetails();
    this.getOfflinePaymentReceiptData();
    this.  getPaymentHistoryDetails();
    this.standarduserdashboardService.receiveDataRequest();
    this.HideTideoChat();

    // if ((this.paymentMethod=='Offline') || (this.paymentStatus=='Pending') || (this.subscriptionStatus=='In-Active')) {
    // alert();
    //   $("#OfflinePaymentReceiptPop").modal('show');

    // }


  }

  HideTideoChat()
  {
    window.tidioChatApi.hide();
  }



  calHighlight() {
    var $calendar;


    let container = $("#CalendarContainer").simpleCalendar({

      fixedStartDay: 0, // begin weeks by sunday
      disableEmptyDetails: true,
      events: [
        {
          startDate: new Date(this.SubscriptionStartDate).toDateString(),
          endDate: new Date(this.SubscrptionExpireDate).toISOString(),
          summary: 'Subscription Duration'
        }

      ],
      onInit: function (calendar) {}

    });
    //  $calendar = container.data('plugin_simpleCalendar')
    var cp = new CircleProgress(document.querySelector('.daily-progress'), { max: 160, value: this.JobAppliedDaily, textFormat: 'value', animation: 'easeInOutCubic' });
    var cp = new CircleProgress(document.querySelector('.weekly-progress'), { max: 1000, value: this.JobAppliedWeekly, textFormat: 'value', animation: 'easeInOutCubic' });
    var cp = new CircleProgress(document.querySelector('.Yearly-progress'), { max: 4000, value: this.JobAppliedMonthly, textFormat: 'value', animation: 'easeInOutCubic' });
    $('div.day').click();
  }




  getDashboardDetails() {
    this.apiService.get('CustomerProfile/DashboardDetails/' + this.customerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        this.ProfileStrength = data.result.profileStrength;
        this.MonthlyPlanRemainingDays = data.result.monthlyPlanRemainingDays;
        this.CurrentMonthJobApplied = data.result.currentMonthJobApplied;
        this.TotalJobApplied = data.result.totalJobApplied;
        this.PackageContentId = data.result.packageContentId;
        this.SubscrptionPlan = data.result.subscrptionPlan;
        this.PackagePrice = data.result.packagePrice.replace('$','');
        this.RenewPackagePrice = data.result.packagePrice;
        this.SubscrptionExpireDate = data.result.subscrptionExpireDate;
        this.SubscriptionStartDate = data.result.subscrptionStartDate;
        this.TempSubscriptionStartDate = new Date(this.SubscriptionStartDate)
        this.SubscrptionExpireDate = data.result.subscrptionExpireDate;
        this.TempSubscrptionExpireDate = new Date(this.SubscrptionExpireDate)
        this.SubscrptionExpireDate = data.result.subscrptionExpireDate;
        this.JobAppliedDaily = data.result.jobAppliedDaily;
        this.JobAppliedWeekly = data.result.jobAppliedWeekly;
        this.JobAppliedMonthly = data.result.jobAppliedMonthly;
        this.JobsAppliedByCountry = data.result.jobsAppliedByCountry;
        this.jqueryMapEvents(this.JobsAppliedByCountry);
        this.JobAppliedDaily = data.result.jobAppliedDaily;
        this.JobAppliedWeekly = data.result.jobAppliedWeekly;
        this.JobAppliedMonthly = data.result.jobAppliedMonthly;
        this.JobsAppliedByCountry = data.result.jobsAppliedByCountry;
        this.SelectedPreferredCountries = data.result.selectedPreferredCountries;
        localStorage.setItem('DashboardDetailsResult', JSON.stringify(data.result));
        this.calHighlight();

      }
    })

  }
  getUpgradeChanges() {
    this.apiService.get('CustomerPlan/CheckPaymentStatus/' + this.customerId).subscribe(data => {
      if (data.statusCode === "201") {
        this.notEligibleForPlanChange = data.result;
      }
    })
  }
  getJobAppliedHistoryDetails() {
    this.apiService.get('CustomerProfile/JobAppliedHistory/' + this.customerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        this.JobHistoryDetails = data.result;


      }
    })
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

  createProfile(){
    this.router.navigate(['customer/personal-profile']);
  }
  UpgradePlan()
  {
    this.router.navigate(['customer/selectPlan']);
  }

  gotoSelectPlanPage()
  {
    var renInfo= {PackageRenew: 'PackageRenew', PackageContentId: this.PackageContentId, PackagePrice: this.RenewPackagePrice }
    this.router.navigate(['customer/selectPlan'], { queryParams: renInfo});
  }
//Offline Payment Reciept Code
getFileName(docPath) {
  var result = docPath.split('\\');
  return result[result.length-1]

}


selectFile(event){
  if(event.target.files.length===0){
  return;
  }
  for(var i=0;i<event.target.files.length;i++){
    this.OfflinePaymentReceipt.push(event.target.files[i]);
  }
  console.log(this.iApplyUser.customerId);
  console.log(this.OfflinePaymentReceipt);
  this.formData = new FormData();
  this.formData.append('AddedBy', this.iApplyUser.customerId);
  for(let i=0;i<this.OfflinePaymentReceipt.length;i++)
  {
  this.formData.append('UploadDocument', this.OfflinePaymentReceipt[i]);
  }
  this.apiService.post('AccountSetting/Receipt', this.formData)
 .subscribe(data => {
  if(data.statusCode === "201" && data.result) {
  this.toastMsg.success('Thank you for Payment Receipt. will take 3 to 5 working days to validate your payment');
  this.getOfflinePaymentReceiptData();
  }
  },err => {
  console.log(err.error)
  if(err.error){
  this.toastMsg.error('File upload error');
  }
  });
}
  getOfflinePaymentReceiptData(){
    this.apiService.get('AccountSetting/Receipt/'+this.customerId).subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.offlinePaymentReceiptData = res.result;
        console.log(res.result);
        localStorage.setItem('ReceiptData', JSON.stringify(res.result));
      }
    });
  }



  jqueryMapEvents(JobsAppliedByCountry){
    try {

      $(".dashboardmapcontainer").mapael({
        map: {
            name: "world_countries",
   zoom: {
                enabled: true,
                maxLevel: 25
            },
            defaultArea: {
                attrs: {
    fill:"#B6C8FF",
                    stroke: "#fff",
                    "stroke-width": 0.5
                },

                attrsHover: {

                  fill: "#304893",

              }
            }
        },
        legend: {
            area: {
                title: "Countries population",
                slices: [
                    {
                        max: 5000000,
                        attrs: {
                            fill: "#2CBF8C"
                        },
                        label: "Less than 5 millions inhabitants"
                    },
                    {
                        min: 5000000,
                        max: 10000000,
                        attrs: {
                            fill: "#2CBF8C"
                        },
                        label: "Between 5 millions and 10 millions inhabitants"
                    },
                    {
                        min: 10000000,
                        max: 50000000,
                        attrs: {
                            fill: "#2CBF8C"
                        },
                        label: "Between 10 millions and 50 millions inhabitants",
                        clicked: true
                    },
                    {
                        min: 50000000,

                        label: "More than 50 millions inhabitants"
                    }
                ]
            },

        },

        areas: JobsAppliedByCountry
    });
       }
       catch (e) { }

  }
  onStart()
  {
    this.router.navigate(['/customer/selectPlan']);
  }


}

