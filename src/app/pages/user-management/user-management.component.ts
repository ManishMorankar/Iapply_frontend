import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from '../../service/excel.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  userManagementDetails: any = [];
  temp;
  currentUser;
  iApplyUser;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
 USERMANAGEMENTform: FormGroup;
  UserStatusList: any = [];
  UserTypeList: any = [];

  TempInternalUserDetails: any= [];

  constructor(private apiService: ApiService, private router: Router,private formBuilder: FormBuilder,private excelService: ExcelService ) { }

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
    this.getInternalUserDetails();

    this.USERMANAGEMENTform = this.formBuilder.group({
      UserStatus:[''],
      UserType: [''],
      FromDate: [''],
      ToDate: [''],
      Email:[''],
      FullName:['']
    });
  }

  getInternalUserDetails() {
    this.apiService.get('User_Details')
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.userManagementDetails = data.result;
          this.TempInternalUserDetails = this.userManagementDetails;
          for (var i = 0; i < this.userManagementDetails.length; i++) {
            this.UserStatusList.push(this.userManagementDetails[i].status);
             this.UserTypeList.push(this.userManagementDetails[i].userType);
         }
          this.UserStatusList = this.UserStatusList.filter((v, i, a) => a.indexOf(v) === i);
          this.UserTypeList = this.UserTypeList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
  }
  searchFilter() {
    if ((this.USERMANAGEMENTform.controls.FromDate.value != null && this.USERMANAGEMENTform.controls.FromDate.value != "") && (this.USERMANAGEMENTform.controls.ToDate.value != null && this.USERMANAGEMENTform.controls.ToDate.value != "") && (this.USERMANAGEMENTform.controls.UserStatus.value == null || this.USERMANAGEMENTform.controls.UserStatus.value == "" || this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value == null || this.USERMANAGEMENTform.controls.UserType.value == "" || this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "") && (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.addedOn >= this.USERMANAGEMENTform.controls.FromDate.value && x.addedOn <= this.USERMANAGEMENTform.controls.ToDate.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }




    else if ((this.USERMANAGEMENTform.controls.FromDate.value != null && this.USERMANAGEMENTform.controls.FromDate.value != "") && (this.USERMANAGEMENTform.controls.ToDate.value != null && this.USERMANAGEMENTform.controls.ToDate.value != "") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "") && (this.USERMANAGEMENTform.controls.UserType.value == null || this.USERMANAGEMENTform.controls.UserType.value == "" || this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "" || this.USERMANAGEMENTform.controls.Email.value == "All")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.addedOn >= this.USERMANAGEMENTform.controls.FromDate.value && x.addedOn <= this.USERMANAGEMENTform.controls.ToDate.value &&  x.status == this.USERMANAGEMENTform.controls.UserStatus.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }



    else if ((this.USERMANAGEMENTform.controls.FromDate.value != null && this.USERMANAGEMENTform.controls.FromDate.value != "") && (this.USERMANAGEMENTform.controls.ToDate.value != null && this.USERMANAGEMENTform.controls.ToDate.value != "") && (this.USERMANAGEMENTform.controls.UserStatus.value == null || this.USERMANAGEMENTform.controls.UserStatus.value == "" || this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "" || this.USERMANAGEMENTform.controls.Email.value == "All") && (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.addedOn >= this.USERMANAGEMENTform.controls.FromDate.value && x.addedOn <= this.USERMANAGEMENTform.controls.ToDate.value &&  x.userType == this.USERMANAGEMENTform.controls.UserType.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }



    else if ((this.USERMANAGEMENTform.controls.FromDate.value != null && this.USERMANAGEMENTform.controls.FromDate.value != "") && (this.USERMANAGEMENTform.controls.ToDate.value != null && this.USERMANAGEMENTform.controls.ToDate.value != "") && (this.USERMANAGEMENTform.controls.UserStatus.value == null || this.USERMANAGEMENTform.controls.UserStatus.value == "" || this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value == null || this.USERMANAGEMENTform.controls.UserType.value == "" || this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value != null && this.USERMANAGEMENTform.controls.Email.value != "")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.addedOn >= this.USERMANAGEMENTform.controls.FromDate.value && x.addedOn <= this.USERMANAGEMENTform.controls.ToDate.value &&  x.emailId == this.USERMANAGEMENTform.controls.Email.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }



    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value != "All") && (this.USERMANAGEMENTform.controls.UserType.value == null || this.USERMANAGEMENTform.controls.UserType.value == "" || this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "") && (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.status == this.USERMANAGEMENTform.controls.UserStatus.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }



    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value == null || this.USERMANAGEMENTform.controls.UserStatus.value == "" || this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value != "All") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "") && (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.userType == this.USERMANAGEMENTform.controls.UserType.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }


    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value == null || this.USERMANAGEMENTform.controls.UserStatus.value == "" || this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value == null || this.USERMANAGEMENTform.controls.UserType.value == "" || this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value != null && this.USERMANAGEMENTform.controls.Email.value != "")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.emailId == this.USERMANAGEMENTform.controls.Email.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }
    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value == null || this.USERMANAGEMENTform.controls.UserStatus.value == "" || this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value == null || this.USERMANAGEMENTform.controls.UserType.value == "" || this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value == null && this.USERMANAGEMENTform.controls.Email.value == "")&& (this.USERMANAGEMENTform.controls.FullName.value != null || this.USERMANAGEMENTform.controls.FullName.value != "")) {
      var filter_array = this.userManagementDetails.filter(x => x.firstName && x.lastName  == this.USERMANAGEMENTform.controls.FullName.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }


    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      this.TempInternalUserDetails =this.userManagementDetails;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }

    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value != "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value != "All") && (this.USERMANAGEMENTform.controls.Email.value == null || this.USERMANAGEMENTform.controls.Email.value == "")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.status  == this.USERMANAGEMENTform.controls.UserStatus.value && x.userType  == this.USERMANAGEMENTform.controls.UserType.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }
    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value != null && this.USERMANAGEMENTform.controls.Email.value != "" && this.USERMANAGEMENTform.controls.Email.value == "All")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      this.TempInternalUserDetails =this.userManagementDetails;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }

    else if ((this.USERMANAGEMENTform.controls.FromDate.value == null || this.USERMANAGEMENTform.controls.FromDate.value == "") && (this.USERMANAGEMENTform.controls.ToDate.value == null || this.USERMANAGEMENTform.controls.ToDate.value == "") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value != "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value != "All") && (this.USERMANAGEMENTform.controls.Email.value != null && this.USERMANAGEMENTform.controls.Email.value != "" && this.USERMANAGEMENTform.controls.Email.value != "All")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "")) {
      var filter_array = this.userManagementDetails.filter(x => x.status  == this.USERMANAGEMENTform.controls.UserStatus.value && x.userType  == this.USERMANAGEMENTform.controls.UserType.value && x.emailId  == this.USERMANAGEMENTform.controls.Email.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }
    else if ((this.USERMANAGEMENTform.controls.FromDate.value != null && this.USERMANAGEMENTform.controls.FromDate.value != "" && this.USERMANAGEMENTform.controls.FromDate.value == "All") && (this.USERMANAGEMENTform.controls.ToDate.value != null && this.USERMANAGEMENTform.controls.ToDate.value != "" && this.USERMANAGEMENTform.controls.ToDate.value == "All") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value == "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value == "All") && (this.USERMANAGEMENTform.controls.Email.value != null && this.USERMANAGEMENTform.controls.Email.value != "" && this.USERMANAGEMENTform.controls.Email.value == "All")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "" || this.USERMANAGEMENTform.controls.FullName.value == "All")) {
      this.TempInternalUserDetails =this.userManagementDetails;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }

    else if ((this.USERMANAGEMENTform.controls.FromDate.value != null && this.USERMANAGEMENTform.controls.FromDate.value != "" && this.USERMANAGEMENTform.controls.FromDate.value != "All") && (this.USERMANAGEMENTform.controls.ToDate.value != null && this.USERMANAGEMENTform.controls.ToDate.value != "" && this.USERMANAGEMENTform.controls.ToDate.value != "All") && (this.USERMANAGEMENTform.controls.UserStatus.value != null && this.USERMANAGEMENTform.controls.UserStatus.value != "" && this.USERMANAGEMENTform.controls.UserStatus.value != "All") && (this.USERMANAGEMENTform.controls.UserType.value != null && this.USERMANAGEMENTform.controls.UserType.value != "" && this.USERMANAGEMENTform.controls.UserType.value != "All") && (this.USERMANAGEMENTform.controls.Email.value != null && this.USERMANAGEMENTform.controls.Email.value != "" && this.USERMANAGEMENTform.controls.Email.value != "All")&& (this.USERMANAGEMENTform.controls.FullName.value == null || this.USERMANAGEMENTform.controls.FullName.value == "" || this.USERMANAGEMENTform.controls.FullName.value == "All")) {
      var filter_array = this.userManagementDetails.filter(x => x.addedOn  >= this.USERMANAGEMENTform.controls.FromDate.value && x.addedOn  <= this.USERMANAGEMENTform.controls.ToDate.value && x.status  == this.USERMANAGEMENTform.controls.UserStatus.value && x.userType  == this.USERMANAGEMENTform.controls.UserType.value && x.emailId  == this.USERMANAGEMENTform.controls.Email.value);
      this.TempInternalUserDetails = filter_array;
      this.TempInternalUserDetails = [...this.TempInternalUserDetails];
    }
  }
  clearFilter() {
    this.USERMANAGEMENTform.reset();
    this.TempInternalUserDetails = this.userManagementDetails;
    this.TempInternalUserDetails = [...this.TempInternalUserDetails];
  }
  exportData() {
    this.excelService.exportAsExcelFile(this.TempInternalUserDetails, 'export-to-excel');
  }
  onAddUserClick(){
    alert("On Add user clicked");
  }
  addInternalUser() {
    this.router.navigate(['app/add-internal-user']);
  }

  updateInternalUser(internalUser){
    console.log(internalUser);
    localStorage.setItem('internalUser', JSON.stringify(internalUser))
    this.router.navigate(['app/add-internal-user']);
  }







}
