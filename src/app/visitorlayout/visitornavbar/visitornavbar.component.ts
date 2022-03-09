import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-visitornavbar',
  templateUrl: './visitornavbar.component.html',
  styleUrls: ['./visitornavbar.component.scss']
})
export class VisitornavbarComponent implements OnInit {

  currentUser;

  constructor(private router:Router, private apiService:ApiService, private toastMsg:ToastrService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'))
  }

  gotoLogin(){
    this.router.navigate(['login']);
  }

  onLogout(){
    let payload = {
      email:this.currentUser.emailId
    }
    if (this.currentUser.customerId){
      this.apiService.post('CustomerAuntentication/Logout', payload).subscribe(data => {
        if (data.statusCode === '201' && data.result){
          localStorage.removeItem('iApplyUser')
          window.location.reload();
          this.toastMsg.success('Logged out successfully')
        }
      }, err => {
        console.log(err)
        this.toastMsg.error('Failed to logout')
      })
    } else {
      localStorage.removeItem('iApplyUser')
      window.location.reload();
    }
  }

}
