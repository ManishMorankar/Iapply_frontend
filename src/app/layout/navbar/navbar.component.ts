import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.template.html'
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  personalProfile: any;
  currentUser;
  ProfilePicture: SafeResourceUrl;

  constructor(private router: Router, private apiService:ApiService, private toastMsg:ToastrService,private _sanitizer: DomSanitizer,) { }

  
  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem('iApplyUser'))
    this.getPersonalProfile();
    $(".menu_icon_toggle").click(function(){

      $('.page-controls.navbar').toggleClass('nav-expanded');
        $(".menu_icon_toggle").toggleClass("active");
      $(".sidebar").toggleClass('expand');
      
    });
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
      let imageUrl; //rename imageFileBinary to imageUrl
      let imageBinary = this.ProfilePicture; //image binary data response from api
      imageUrl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imageBinary);
      return imageUrl;
  }

}
