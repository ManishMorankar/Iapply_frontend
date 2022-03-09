import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmationLeaveComponent } from '../../confirmation-leave/confirmation-leave.component'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.template.html'
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  personalProfile: any;
  currentUser;
  ProfilePicture: SafeResourceUrl;
  noImg;
  iApplyUser: any;
  customerId: any;
  paymentStatus: any;
  status: any;
  paymentInfo: any;
  paymentMethod: any;
  subscriptionStatus: any;
  constructor(private router: Router, private modalService: BsModalService, private apiService:ApiService, private toastMsg:ToastrService, private _sanitizer: DomSanitizer) { }




  ngOnInit(): void {

    $.getScript('assets/js/jquery.mapael.js')
    var len = $('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]').length;
    if (len == 0) {
      $.getScript('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    }


    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'))
    this.getPersonalProfile();


    if (localStorage.getItem("iApplyUser") != 'null') {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      this.customerId = this.iApplyUser.customerId;
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    if (localStorage.getItem("paymentInfo") != 'null') {
      this.paymentInfo= JSON.parse(localStorage.getItem("paymentInfo"));
      this.paymentMethod=this.paymentInfo.paymentMethod;
      this.paymentStatus=this.paymentInfo.paymentStatus;
      this.status=this.paymentInfo.status;
      this.subscriptionStatus=this.paymentInfo.subscriptionStatus;

    }
  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }
  getPersonalProfile() {
    this.apiService.get('CustomerProfile/PersonalProfile/' + this.currentUser.customerId)
        .subscribe(data => {
          if (data.statusCode === '201' && data.result) {
            this.personalProfile = data.result
            if (this.personalProfile.firstName == "") {
              return;
            }
            this.ProfilePicture = this.personalProfile.imageResult

          } else {
            this.toastMsg.error(data.result);
          }
        })
  }
  logout() {  
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
  getProfileImage() {
    if (this.ProfilePicture == null || this.ProfilePicture == undefined || this.ProfilePicture == '') {
      this.noImg = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg==');
        return this.noImg;
    }
    else{
    let imageUrl; //rename imageFileBinary to imageUrl
    let imageBinary = this.ProfilePicture; //image binary data response from api
    imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
    return imageUrl;
    }
}
onStart()
  {
    this.router.navigate(['/customer/selectPlan']);
  }
}
