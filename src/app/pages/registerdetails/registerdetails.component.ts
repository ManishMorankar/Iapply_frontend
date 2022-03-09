import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from '../../service/excel.service';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
@Component({
  selector: 'app-registerdetails',
  templateUrl: './registerdetails.component.html',
  styleUrls: ['./registerdetails.component.scss']
})
export class RegisterdetailsComponent implements OnInit {

  RegisterUserDetails: any = [];
  temp;
  currentUser;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  TempRegisterUserDetails:  any = [];
  RegisterUserform: FormGroup;
  RegisterUserFilterform: FormGroup;
  UserStatusList: any = [];
  PaymentStatusList:  any = [];
  PlanList:  any = [];
  PaymentMethodList:  any = [];
  CountryList: any = [];
  EndDateValue:string;
  constructor(private apiService: ApiService, protected datePipe: DatePipe,
    private router: Router,private formBuilder: FormBuilder,private excelService: ExcelService) { }

  ngOnInit(): void {
    let EndDateValue = new Date().toISOString().split('T')[0];
    var DateValue = new Date();
    DateValue.setDate(DateValue.getDate() - 30);
    let FromDateValue = DateValue.toISOString().split('T')[0];

    this.datePipe.transform(FromDateValue,'yyyy-MM-dd');
    this.datePipe.transform(EndDateValue,'yyyy-MM-dd');
//this.RegisterUserFilterform.setValue(FromDate:FromDateValue)
        this.getRegisterUserDetails("");
        this.RegisterUserFilterform = this.formBuilder.group({
          Plan:[''],
          PaymentMethod: [''],
          PaymentStatus: [''],
          UserStatus: [''],
          Email:[''],
          FullName:[''],
          FromDate:[FromDateValue],
          UserId:[''],
          ToDate:[EndDateValue],
          Country:['']
        });
      }

  getRegisterUserDetails(SubscrbedUserFilter) {
    this.apiService.get('Customer?' + SubscrbedUserFilter).subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.RegisterUserDetails = data.result;
          this.TempRegisterUserDetails = this.RegisterUserDetails;
          for (var i = 0; i < this.RegisterUserDetails.length; i++) {
            this.UserStatusList.push(this.RegisterUserDetails[i].userStatus);
            this.PaymentStatusList.push(this.RegisterUserDetails[i].paymentStatus);
            this.PlanList.push(this.RegisterUserDetails[i].plan);
            this.PaymentMethodList.push(this.RegisterUserDetails[i].paymentMethod);
            this.CountryList.push(this.RegisterUserDetails[i].country);
         }
          this.UserStatusList = this.UserStatusList.filter((v, i, a) => a.indexOf(v) === i);
          this.PaymentStatusList = this.PaymentStatusList.filter((v, i, a) => a.indexOf(v) === i);
          this.PlanList= this.PlanList.filter((v, i, a) => a.indexOf(v) === i);
          this.PaymentMethodList = this.PaymentMethodList.filter((v, i, a) => a.indexOf(v) === i);
          this.CountryList=this.CountryList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
  }

  updateRegisterUser(row){
    // console.log(RegisterUser);
    // localStorage.setItem('RegisterUser', JSON.stringify(RegisterUser))
    // var customerId = row.customerId;
    // this.router.navigate(['/app/instructor/instructor-update'], { queryParams: { instructor_id: instructor_id } });
    this.router.navigate(['app/registerupdate'], { queryParams: { customerId: row.customerId }});

  }


  searchFilter() {
    var SubscrbedUserFilter = "Plan=" + this.RegisterUserFilterform.controls.Plan.value + "&PaymentMethod=" + this.RegisterUserFilterform.controls.PaymentMethod.value + "&PaymentStatus=" + this.RegisterUserFilterform.controls.PaymentStatus.value + "&UserStatus=" + this.RegisterUserFilterform.controls.UserStatus.value + "&Country=" + this.RegisterUserFilterform.controls.Country.value + "&FromDate=" + this.RegisterUserFilterform.controls.FromDate.value + "&ToDate=" + this.RegisterUserFilterform.controls.ToDate.value + "&EmailAddress=" + this.RegisterUserFilterform.controls.Email.value + "&FulllName=" + this.RegisterUserFilterform.controls.FullName.value + "&UserId=" + this.RegisterUserFilterform.controls.UserId.value;
    this.getRegisterUserDetails(SubscrbedUserFilter);
   /*  if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.RegisterUserFilterform.controls.ToDate.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value != null && this.RegisterUserFilterform.controls.UserStatus.value != "" && this.RegisterUserFilterform.controls.UserStatus.value != "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.activeStatus == this.RegisterUserFilterform.controls.UserStatus.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value != null || this.RegisterUserFilterform.controls.Plan.value != "" || this.RegisterUserFilterform.controls.Plan.value != "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.plan == this.RegisterUserFilterform.controls.Plan.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value != null && this.RegisterUserFilterform.controls.Email.value != "" && this.RegisterUserFilterform.controls.Email.value != "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.emailId == this.RegisterUserFilterform.controls.Email.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value != null && this.RegisterUserFilterform.controls.FullName.value != "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.firstName && x.lastName == this.RegisterUserFilterform.controls.Email.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value != null && this.RegisterUserFilterform.controls.PaymentMethod.value != "" && this.RegisterUserFilterform.controls.PaymentMethod.value != "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.paymentMethod == this.RegisterUserFilterform.controls.PaymentMethod.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value != null && this.RegisterUserFilterform.controls.PaymentStatus.value != "" && this.RegisterUserFilterform.controls.PaymentStatus.value != "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.paymentStatus == this.RegisterUserFilterform.controls.PaymentStatus.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value != null && this.RegisterUserFilterform.controls.UserId.value != "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.userId == this.RegisterUserFilterform.controls.UserId.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value != null && this.RegisterUserFilterform.controls.ToDate.value != "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value != null && this.RegisterUserFilterform.controls.Country.value != "" && this.RegisterUserFilterform.controls.Country.value != "All") ){
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn >= this.RegisterUserFilterform.controls.FromDate.value && x.addedOn <= this.  RegisterUserFilterform.controls.ToDate.value &&  x.country == this.RegisterUserFilterform.controls.Country.value);
      this.TempRegisterUserDetails= filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    //Single Field Search Tab
    // else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value != null && this.RegisterUserFilterform.controls.UserStatus.value != "" && this.RegisterUserFilterform.controls.UserStatus.value != "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    // {
    //   var filter_array = this.RegisterUserDetails.filter(x => x.activeStatus == this.RegisterUserFilterform.controls.UserStatus.value);
    //   this.TempRegisterUserDetails = filter_array;
    //   this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    // }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value != null && this.RegisterUserFilterform.controls.UserStatus.value != "" && this.RegisterUserFilterform.controls.UserStatus.value != "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.activeStatus == this.RegisterUserFilterform.controls.UserStatus.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value != null && this.RegisterUserFilterform.controls.Plan.value != "" && this.RegisterUserFilterform.controls.Plan.value != "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.plan == this.RegisterUserFilterform.controls.Plan.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value != null && this.RegisterUserFilterform.controls.Email.value != "" && this.RegisterUserFilterform.controls.Email.value != "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.emailId == this.RegisterUserFilterform.controls.Email.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value != null && this.RegisterUserFilterform.controls.FullName.value != "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.firstName && x.lastName == this.RegisterUserFilterform.controls.FullName.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value != null && this.RegisterUserFilterform.controls.PaymentMethod.value != "" && this.RegisterUserFilterform.controls.PaymentMethod.value != "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.paymentMethod == this.RegisterUserFilterform.controls.PaymentMethod.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value != null && this.RegisterUserFilterform.controls.PaymentStatus.value != "" && this.RegisterUserFilterform.controls.PaymentStatus.value != "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.paymentStatus == this.RegisterUserFilterform.controls.PaymentStatus.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value != null && this.RegisterUserFilterform.controls.UserId.value != "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.userId == this.RegisterUserFilterform.controls.UserId.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }

    else if ((this.RegisterUserFilterform.controls.FromDate.value == null || this.RegisterUserFilterform.controls.FromDate.value == "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value != null && this.RegisterUserFilterform.controls.Country.value != "" && this.RegisterUserFilterform.controls.Country.value != "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.country == this.RegisterUserFilterform.controls.Country.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }
    else if ((this.RegisterUserFilterform.controls.FromDate.value != null && this.RegisterUserFilterform.controls.FromDate.value != "") && (this.RegisterUserFilterform.controls.ToDate.value == null || this.RegisterUserFilterform.controls.ToDate.value == "") && (this.RegisterUserFilterform.controls.UserStatus.value == null || this.RegisterUserFilterform.controls.UserStatus.value == "" || this.RegisterUserFilterform.controls.UserStatus.value == "All") && (this.RegisterUserFilterform.controls.Plan.value == null || this.RegisterUserFilterform.controls.Plan.value == "" || this.RegisterUserFilterform.controls.Plan.value == "All") && (this.RegisterUserFilterform.controls.Email.value == null || this.RegisterUserFilterform.controls.Email.value == "" || this.RegisterUserFilterform.controls.Email.value == "All") && (this.RegisterUserFilterform.controls.FullName.value == null || this.RegisterUserFilterform.controls.FullName.value == "") && (this.RegisterUserFilterform.controls.PaymentMethod.value == null || this.RegisterUserFilterform.controls.PaymentMethod.value == "" || this.RegisterUserFilterform.controls.PaymentMethod.value == "All") && (this.RegisterUserFilterform.controls.PaymentStatus.value == null || this.RegisterUserFilterform.controls.PaymentStatus.value == "" || this.RegisterUserFilterform.controls.PaymentStatus.value == "All") && (this.RegisterUserFilterform.controls.UserId.value == null || this.RegisterUserFilterform.controls.UserId.value == "") &&  (this.RegisterUserFilterform.controls.Country.value == null || this.RegisterUserFilterform.controls.Country.value == "" || this.RegisterUserFilterform.controls.Country.value == "All"))
    {
      var filter_array = this.RegisterUserDetails.filter(x => x.addedOn == this.RegisterUserFilterform.controls.FromDate.value);
      this.TempRegisterUserDetails = filter_array;
      this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    }*/
  }
  clearFilter() {
    this.RegisterUserFilterform.reset();
   // this.TempRegisterUserDetails = this.RegisterUserDetails;
   // this.TempRegisterUserDetails = [...this.TempRegisterUserDetails];
    this.getRegisterUserDetails("");
  }
  exportData() {
    this.excelService.exportAsExcelFile(this.TempRegisterUserDetails, 'export-to-excel');
  }
}
