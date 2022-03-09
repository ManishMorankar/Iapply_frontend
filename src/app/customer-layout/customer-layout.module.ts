import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerLayoutComponent } from './customer-layout.component';
import { CustomerLayoutRoutingModule } from './customer-layout-routing.module';
import { HelperService } from '../layout/helper/helper.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LogoutComponent } from './logout/logout.component';



@NgModule({
  declarations: [
    CustomerLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    LogoutComponent,

  ],
  imports: [
    CommonModule,
    CustomerLayoutRoutingModule,
    TooltipModule.forRoot(),
    LoadingBarRouterModule,
    BsDropdownModule.forRoot(),

  ],
  providers: [
    HelperService
  ]
})
export class CustomerLayoutModule { }
