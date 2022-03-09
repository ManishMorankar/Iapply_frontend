import {Component, OnInit, Input ,ElementRef, AfterViewInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AnyRecordWithTtl } from 'dns';
import { environment } from '../../../environments/environment';
// import { AppConfig } from '../../app.config';
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
  UATLink:any;
  constructor(el: ElementRef, router: Router, location: Location) {
    this.$el = jQuery(el.nativeElement);
    // this.config = config.getConfig();
    // this.configFn = config;
    this.router = router;
    this.location = location;
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
    $('#sidebar').removeClass('expand');
   

    $(function() {
      $('.nav>li>a, .sub-menu>li>a').click(function(item) {
        $('.nav>li, .sub-menu>li').removeClass('active');
        $(this).parent().addClass('active');
      });
    });
    $('.has_sub').click(function(){
      
        $(this).children('.inr_sub').toggleClass('hide');
        $(this).find('i').toggleClass('rotate_ar');
        
});
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeActiveNavigationItem(this.location);
        $('.menu_icon_toggle').click();
        $('.menu_icon_toggle').removeClass('active');
        $('#sidebar').removeClass('expand');
      }
    });

    this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
    this.currentUserDetailsId = this.iApplyUser.userDetailsId;
    this.currentUserType = this.iApplyUser.userType;
    this.currentCustomerId = this.iApplyUser.CustomerId;
  }

  logout() {
    this.router.navigate(['/login']);
  }
  gotoRegisteruserDetailsPage(){
    this.router.navigate(['app/registerUserDetails']);
  }
  gotousermanagementPage()
  {
    this.router.navigate(['app/user-management']);
  }
}
