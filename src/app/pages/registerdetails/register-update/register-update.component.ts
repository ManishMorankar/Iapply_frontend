import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register-update',
  templateUrl: './register-update.component.html',
  styleUrls: ['./register-update.component.scss']
})
export class RegisterUpdateComponent implements OnInit {
  registerUser: any;
  registerUser_id: any;
  customerId: any;
  RegisterUserDetails: any;
  offlinePaymentReceiptData: any;
  customerPlanId: any;
  submitted: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiService: ApiService,private toastMsg:ToastrService) { }

  ngOnInit(): void {

    this.offlinePaymentReceiptData = JSON.parse(localStorage.getItem('offlinePaymentReceiptData'));

    this.activatedRoute.queryParams.subscribe( params =>
      this.customerId = params['customerId']
    )

    this.getRegisterUserDetails();
    this.getOfflinePaymentReceiptData();
  }

  getRegisterUserDetails(){
    this.apiService.get('Customer/'+this.customerId).subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.RegisterUserDetails = data.result;
        }
      })
  }

  getFileName(docPath) {
    var result = docPath.split('\\');
    return result[result.length-1]
  }

  getOfflinePaymentReceiptData(){
    this.apiService.get('AccountSetting/Receipt/'+this.customerId).subscribe(res => {
      if (res.statusCode == "201" && res.result) {
        this.offlinePaymentReceiptData = res.result;
        localStorage.setItem('offlinePaymentReceiptData ', JSON.stringify(res.result));
      }
    });
  }
onAccept(event){
    this.customerPlanId=event.customerPlanId;
        this.submitted = true;
          let payload= {
            customerPlanId: this.customerPlanId,
            status:"Accepted",
              AddedBy: this.customerId
          }
            this.apiService.post('AccountSetting/ReceiptApprovedOrRejectByAdmin', payload).subscribe(data => {
              if (data.statusCode === '201' && data.result){
                this.toastMsg.success('Offline Payment Receipt Accepted Successfully and Status Changed Successfully');
              }
            }, err => {
              console.log(err.error)
              if (err.error){
                this.toastMsg.error('Status Change Failed');
              }
            });
          }

onReject(event){
    this.customerPlanId=event.customerPlanId;
    this.submitted = true;
    let payload=
    {
    customerPlanId: this.customerPlanId,
    status:"Rejected",
    AddedBy: this.customerId
    }
    this.apiService.post('AccountSetting/ReceiptApprovedOrRejectByAdmin', payload).subscribe(data => {
    if (data.statusCode === '201' && data.result){
    this.toastMsg.success('Offline Payment Receipt Rejected  Successfully and Status Changed Successfully');
    }
    }, err => {
    console.log(err.error)
    if (err.error){
     this.toastMsg.error('Status Change Failed');
    }
    });
    }

  onBack(){
    this.router.navigate(['app/registerUserDetails']);
  }

}
