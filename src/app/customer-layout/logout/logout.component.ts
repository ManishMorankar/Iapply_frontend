import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  currentUser: any;

  constructor(private apiService:ApiService, private toastMsg:ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'));
    let payload = {
      email:this.currentUser.emailId
    }
    if (this.currentUser.customerId){
      this.apiService.post('CustomerAuntentication/Logout', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          localStorage.removeItem('iApplyUser');
          localStorage.removeItem('token');
          localStorage.removeItem("paymentInfo");
          this.toastMsg.success('Logged out successfully');
          this.router.navigate(['login']);
        }
      }, err => {
        console.log(err)
        this.toastMsg.error('Failed to logout')
      });
    } else {
      this.apiService.post('UserAuntentication/Logout', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          localStorage.removeItem('iApplyUser');
          localStorage.removeItem('token');
          localStorage.removeItem("paymentInfo");
          this.toastMsg.success('Logged out successfully');
          this.router.navigate(['login/admin']);
        }
      }, err => {
        console.log(err)
        this.toastMsg.error('Failed to logout')
      });
    }
  }

}
