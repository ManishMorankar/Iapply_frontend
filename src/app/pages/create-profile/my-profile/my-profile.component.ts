import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  firstName: any;
  personalProfile: any;
  currentUser: any;
  CustomerProfileId: 0;
  iApplyUser: any;
  customerId: any;
  completedStep: any = 0;

  constructor(private router: Router,private apiService: ApiService,private toastMsg:ToastrService) { }

  redirectUri: string = environment.linkedInRedirectUri;
  clientId: string = environment.linkedInClientId;
  profile: string = environment.linkedInProfile;

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
    if (localStorage.getItem("iApplyUser") != 'null') {
      this.iApplyUser= JSON.parse(localStorage.getItem("iApplyUser"));
      this.firstName=this.iApplyUser.firstName;
    }
    localStorage.setItem('current-step', "1");
    
    if (localStorage.getItem("LinkedInProfile")) {
      localStorage.removeItem("LinkedInProfile");
    }
    if (localStorage.getItem("ResumeProfile")) {
      localStorage.removeItem("ResumeProfile");
    }
  }

  uploadResume(){
    this.router.navigate(['customer/upload-resume']);
  }

  linkedinLogin() {
    window.location.href = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' + this.clientId + '&scope=' + this.profile +'&redirect_uri='+this.redirectUri;
  }

  createProfile() {
    localStorage.setItem('current-step', "2");
    this.completedStep = localStorage.getItem('completed-steps');
    if (this.completedStep < 2) {
      localStorage.setItem('completed-steps', "1");
    }
    this.router.navigate(['customer/personal-profile']);
      // this.apiService.get('CustomerProfile/PersonalProfile/' + this.iApplyUser.customerId)
      //   .subscribe(data => {
      //     if (data.statusCode === '201' && data.result) {
      //       this.personalProfile = data.result;
      //       if(this.firstName==null)
      //       {
      //         this.router.navigate(['customer/personal-profile']);
      //       }
      //       else
      //       {
      //         this.router.navigate(['customer/review']);
      //       }

      //   }
      // })
  }

  }



