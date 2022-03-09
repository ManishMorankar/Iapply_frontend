import {Component, OnInit, ElementRef, AfterViewInit, Input} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppConfig } from '../../app.config';
import { DataService } from '../../service/data.service';
import { PaymentService } from '../../service/payment.service';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
declare let jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.template.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, AfterViewInit {

  $el: any;
  config: any;
  configFn: any;
  router: Router;
  location: Location;
  iApplyUser: any;
  currentUserDetailsId: any;
  currentUserType: any;
  currentCustomerId: any;
  paymentStatus: any;
  paymentInfo: any;
  paymentMethod: any;
  status: any;
  subscriptionStatus: any;
  @Input() childMessage: string;
  message: string;
  VideoUrlLink: string;
  PaymentHistoryDetails: any;
  newpaymentStatus: any;

  constructor(config: AppConfig, el: ElementRef, private apiService: ApiService,router: Router, location: Location, private data: DataService, private pService: PaymentService) {
    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.configFn = config;
    this.router = router;
    this.location = location;
    this.data.currentMessage.subscribe(message => this.message = message)
    this.pService.currentMessage.subscribe(message => this.subscriptionStatus = message)
  }

  goToMyProfile() {
    this.message = "active";
    if (this.subscriptionStatus == "Active" || this.subscriptionStatus == "Past-Active" || this.subscriptionStatus == "In-Active") {
      $('.menu_icon_toggle').click();
      $('.menu_icon_toggle').removeClass('active');
      this.router.navigate(['/customer/personal-profile']);
    }
    else {
      $('.menu_icon_toggle').click();
      $('.menu_icon_toggle').removeClass('active');
      this.router.navigate(['/customer/MyProfile']);
    }
  }

  // initSidebarScroll(): void {
  //   const $sidebarContent = this.$el.find('.js-sidebar-content');
  //   if (this.$el.find('.slimScrollDiv').length !== 0) {
  //     $sidebarContent.slimscroll({
  //       destroy: true
  //     });
  //   }
  //   $sidebarContent.slimscroll({
  //     height: window.innerHeight,
  //     size: '4px',
  //     color: '#e5e7f1',
  //   });
  // }

  changeActiveNavigationItem(location): void {
    const $newActiveLink = this.$el.find('a[href="#' + location.path().split('?')[0] + '"]');

    // collapse .collapse only if new and old active links belong to different .collapse
    if (!$newActiveLink.is('.active > .collapse > li > a')) {
      this.$el.find('.active .active').closest('.collapse').collapse('hide');
    }

    // uncollapse parent
    $newActiveLink.closest('.collapse').addClass('in').css('height', '')
      .siblings('a[data-toggle=collapse]').removeClass('collapsed');
  }

  ngAfterViewInit(): void {
    this.changeActiveNavigationItem(this.location);
  }

  toggleSidebarOverflow($event) {
    jQuery('#sidebar').css('z-index', $event ? '2' : '0' );
    jQuery('.js-sidebar-content, .slimScrollDiv').css('overflow', $event ? 'visible' : 'hidden');
  }
  Url: string = environment.Link;
  ngOnInit(): void {
    // jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
    // this.initSidebarScroll();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeActiveNavigationItem(this.location);
        $('.menu_icon_toggle').click();
        $('.menu_icon_toggle').removeClass('active');
      }
    });
    /*if (localStorage.getItem("paymentInfo") != 'null') {
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

    this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
    this.currentUserDetailsId = this.iApplyUser.userDetailsId;
    this.currentUserType = this.iApplyUser.userType;
    this.currentCustomerId = this.iApplyUser.customerId;

    if (localStorage.getItem("paymentStatus") == "true") {
      this.paymentStatus = true;
    }
  // if(this.paymentStatus == "Success")
  // {
  //   this.VideoUrlLink='https://www.youtube.com/watch?v=GGrMjiPtNVU';
  // }
  //   else
  // {
  //   this.VideoUrlLink='https://www.youtube.com/watch?v=eZ2hbhsvFO0';
  // }
  this.getPaymentHistoryDetails();
  }
  getPaymentHistoryDetails()
  {
    this.apiService.get('CustomerProfile/PaymentHistory/'+  this.currentCustomerId).subscribe(data => {
      if (data.statusCode === "201" && data.result) {
        this.PaymentHistoryDetails = data.result;
        this.newpaymentStatus=this.PaymentHistoryDetails[0].paymentStatus;

    }

    })
}
  logout() {
    this.router.navigate(['/login']);
  }
 gotoContactUsPage()
 {
  this.router.navigate(['/visitor/contact-us']);
 }
}
