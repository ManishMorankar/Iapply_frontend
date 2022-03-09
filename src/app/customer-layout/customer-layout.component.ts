import {Component, ElementRef, HostBinding, NgZone, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {AppConfig} from '../app.config';
import {DashboardThemes} from '../layout/helper/helper.interface';
import { HelperService } from '../layout/helper/helper.service';
import { DataService } from '../service/data.service';
import { PaymentService } from '../service/payment.service';

declare let jQuery: any;
declare let Hammer: any;
declare let Raphael: any;
declare var $: any;

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerLayoutComponent implements OnInit {



  @HostBinding('class.nav-static') navStatic: boolean;
  @HostBinding('class.chat-sidebar-opened') chatOpened: boolean = false;
  @HostBinding('class.app') appClass: boolean = true;
  @HostBinding('class.sing-dashboard') singDashboardClass: boolean = true;
  @HostBinding('class.dashboard-light') get dashboardLight() {
    return this.helperService.dashboardTheme === DashboardThemes.LIGHT;
  }
  @HostBinding('class.dashboard-dark') get dashboardDark() {
    return this.helperService.dashboardTheme === DashboardThemes.DARK;
  }
  paymentResponseStatus: string;
  config: any;
  configFn: any;
  $sidebar: any;
  subscriptionStatus: any;
  paymentStatus: any;
  paymentInfo: any;
  paymentMethod: any;
  status: any;
  el: ElementRef;
  router: Router;
  @ViewChild('spinnerElement', {static: true}) spinnerElement: ElementRef;
  @ViewChild('routerComponent', {static: true}) routerComponent: ElementRef;

  constructor(private data: DataService,config: AppConfig,
              el: ElementRef,
              router: Router,
              private renderer: Renderer2,
              private ngZone: NgZone,
    private helperService: HelperService,
    private pService: PaymentService
  ) {
    Raphael.prototype.safari = function(): any { return; };
    this.el = el;
    this.config = config.getConfig();
    this.configFn = config;


    this.router = router;


    this.pService.currentMessage.subscribe({
      next(message) {
        this.paymentResponseStatus = message;
        console.log('Payment status Message: ', message);

      },
      error(msg) {
        console.log('Error Getting message: ', msg);
      }
    });
  }

  toggleSidebarListener(state): void {
    const toggleNavigation = state === 'static'
      ? this.toggleNavigationState
      : this.toggleNavigationCollapseState;
    toggleNavigation.apply(this);
    localStorage.setItem('nav-static', JSON.stringify(this.navStatic));
  }

  showPaymentError() {
    if (this.paymentResponseStatus == "Success") {
      return false;
    }
    return true;
  }

  toggleChatListener(): void {
    jQuery(this.el.nativeElement).find('.chat-notification-sing').remove();
    this.chatOpened = !this.chatOpened;

    setTimeout(() => {
      // demo: add class & badge to indicate incoming messages from contact
      // .js-notification-added ensures notification added only once
      jQuery('.chat-sidebar-user-group:first-of-type ' +
        '.list-group-item:first-child:not(.js-notification-added)')
        .addClass('active js-notification-added')
        .find('.fa-circle')
        .before('<span class="badge badge-danger badge-pill ' +
          'float-right animated bounceInDown">3</span>');
    }, 1000);
  }

  toggleNavigationState(): void {
    this.navStatic = !this.navStatic;
    if (!this.navStatic) {
      this.collapseNavigation();
    }
  }

  expandNavigation(): void {
    // this method only makes sense for non-static navigation state
    if (this.isNavigationStatic()
      && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) { return; }
    jQuery('app-layout').removeClass('nav-collapsed');
    this.$sidebar.find('.active .active').closest('.collapse').collapse('show')
      .siblings('[data-toggle=collapse]').removeClass('collapsed');
  }

  collapseNavigation(): void {
    // this method only makes sense for non-static navigation state
    if (this.isNavigationStatic()
      && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) { return; }

    jQuery('app-layout').addClass('nav-collapsed');
    this.$sidebar.find('.collapse.in').collapse('hide')
      .siblings('[data-toggle=collapse]').addClass('collapsed');
  }

  /**
   * Check and set navigation collapse according to screen size and navigation state
   */
  checkNavigationState(): void {
    if (this.isNavigationStatic()) {
      if (this.configFn.isScreen('sm')
        || this.configFn.isScreen('xs') || this.configFn.isScreen('md')) {
        this.collapseNavigation();
      }
    } else {
      if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
        setTimeout(() => {
          this.collapseNavigation();
        }, this.config.settings.navCollapseTimeout);
      } else {
        this.collapseNavigation();
      }
    }
  }

  isNavigationStatic(): boolean {
    return this.navStatic === true;
  }

  toggleNavigationCollapseState(): void {
    if (jQuery('app-layout').is('.nav-collapsed')) {
      this.expandNavigation();
    } else {
      this.collapseNavigation();
    }
  }

  _sidebarMouseEnter(): void {
    if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
      this.expandNavigation();
    }
  }
  _sidebarMouseLeave(): void {
    if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
      this.collapseNavigation();
    }
  }

  enableSwipeCollapsing(): void {
    const swipe = new Hammer(document.getElementById('content-wrap'));
    const d = this;

    swipe.on('swipeleft', () => {
      setTimeout(() => {
        if (d.configFn.isScreen('md')) { return; }

        if (!jQuery('app-layout').is('.nav-collapsed')) {
          d.collapseNavigation();
        }
      });
    });

    swipe.on('swiperight', () => {
      if (d.configFn.isScreen('md')) { return; }

      if (jQuery('app-layout').is('.chat-sidebar-opened')) { return; }

      if (jQuery('app-layout').is('.nav-collapsed')) {
        d.expandNavigation();
      }
    });
  }

  collapseNavIfSmallScreen(): void {
    if (this.configFn.isScreen('xs')
      || this.configFn.isScreen('sm') || this.configFn.isScreen('md')) {
      this.collapseNavigation();
    }
  }

  ngOnInit(): void {
      $(".menu_icon_toggle").click(function(){
        $('.page-controls.navbar').toggleClass('nav-expanded');
          $(".menu_icon_toggle").toggleClass("active");
        $(".sidebar").toggleClass('expand');

      });

      $(".sidebar-menu ul li").click(function(){

       $(".sidebar").removeClass('expand');
      });

      $('.phone-control').each(function(){
        var input = this;
        window['intlTelInput'](input, {
          // allowDropdown: false,
            autoHideDialCode: true,
          // autoPlaceholder: "off",
          // dropdownContainer: document.body,
          // excludeCountries: ["us"],
          formatOnDisplay: false,
          // geoIpLookup: function(callback) {
          //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
          //     var countryCode = (resp && resp.country) ? resp.country : "";
          //     callback(countryCode);
          //   });
          // },
          // hiddenInput: "full_number",
           initialCountry: "auto",
          // localizedCountries: { 'de': 'Deutschland' },
           nationalMode: true,
          // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
          // placeholderNumberType: "MOBILE",
          // preferredCountries: ['cn', 'jp'],
          // separateDialCode: true,
          utilsScript: "../assets/js/utils.js",
        });
      })


    if (localStorage.getItem('nav-static') === 'true') {
      this.navStatic = true;
    }
    if (localStorage.getItem("paymentInfo")!='null') {
      this.paymentInfo= JSON.parse(localStorage.getItem("paymentInfo"));
      this.paymentMethod=this.paymentInfo.paymentMethod;
      this.paymentStatus=this.paymentInfo.paymentStatus;
      this.status=this.paymentInfo.status;
      this.subscriptionStatus=this.paymentInfo.subscriptionStatus;
    }
    const $el = jQuery(this.el.nativeElement);
    this.$sidebar = $el.find('app-sidebar');

    $el.find('a[href="#"]').on('click', (e) => {
      e.preventDefault();
    });

    this.$sidebar.on('mouseenter', this._sidebarMouseEnter.bind(this));
    this.$sidebar.on('mouseleave', this._sidebarMouseLeave.bind(this));

    this.checkNavigationState();

    this.$sidebar.on('click', () => {
      if (jQuery('app-layout').is('.nav-collapsed')) {
        this.expandNavigation();
      }
    });

    this.router.events.subscribe((event) => {
      this._navigationInterceptor(event);
      this.collapseNavIfSmallScreen();
      window.scrollTo(0, 0);
    });

    if ('ontouchstart' in window) {
      this.enableSwipeCollapsing();
    }

    this.$sidebar.find('.collapse').on('show.bs.collapse', function(e): void {
      // execute only if we're actually the .collapse element initiated event
      // return for bubbled events
      if (e.target !== e.currentTarget) { return; }

      const $triggerLink = jQuery(this).prev('[data-toggle=collapse]');
      jQuery($triggerLink.data('parent'))
        .find('.collapse.show').not(jQuery(this)).collapse('hide');
    })
    /* adding additional classes to navigation link li-parent
     for several purposes. see navigation styles */
      .on('show.bs.collapse', function(e): void {
        // execute only if we're actually the .collapse element initiated event
        // return for bubbled events
        if (e.target !== e.currentTarget) { return; }

        jQuery(this).closest('li').addClass('open');
      }).on('hide.bs.collapse', function(e): void {
      // execute only if we're actually the .collapse element initiated event
      // return for bubbled events
      if (e.target !== e.currentTarget) { return; }

      jQuery(this).closest('li').removeClass('open');
    });
  }

  private _navigationInterceptor(event: RouterEvent): void {

    if (event instanceof NavigationStart) {
      // We wanna run this function outside of Angular's zone to
      // bypass change detection
      this.ngZone.runOutsideAngular(() => {

        // For simplicity we are going to turn opacity on / off
        // you could add/remove a class for more advanced styling
        // and enter/leave animation of the spinner
        this.renderer.setStyle(
          this.spinnerElement.nativeElement,
          'opacity',
          '1'
        );
        this.renderer.setStyle(
          this.routerComponent.nativeElement,
          'opacity',
          '0'
        );
      });
    }
    if (event instanceof NavigationEnd) {
      this._hideSpinner();
    }

    // Set loading state to false in both of the below events to
    // hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this._hideSpinner();
    }
    if (event instanceof NavigationError) {
      this._hideSpinner();
    }
  }

  private _hideSpinner(): void {
    // We wanna run this function outside of Angular's zone to
    // bypass change detection,
    this.ngZone.runOutsideAngular(() => {

      // For simplicity we are going to turn opacity on / off
      // you could add/remove a class for more advanced styling
      // and enter/leave animation of the spinner
      this.renderer.setStyle(
        this.spinnerElement.nativeElement,
        'opacity',
        '0'
      );
      this.renderer.setStyle(
        this.routerComponent.nativeElement,
        'opacity',
        '1'
      );
    });
  }
  onStart()
  {

    this.router.navigate(['/customer/selectPlan']);
  }
}
