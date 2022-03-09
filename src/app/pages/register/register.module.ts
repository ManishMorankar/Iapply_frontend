import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {RegisterComponent} from './register.component';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {RegisterService} from './register.service';
import { VerfiedOTPComponent } from './verfied-otp/verfied-otp.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';

export const routes = [
  {path: '', component: RegisterComponent, pathMatch: 'full'},
  {path: 'register/VerfiedOTP', component: VerfiedOTPComponent},
  {path: 'register/ResendOTP', component: VerfiedOTPComponent}
];

@NgModule({
  declarations: [
    RegisterComponent,
    VerfiedOTPComponent,
    ResendOtpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NewWidgetModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    ModalModule,


  ],
  providers: [
    RegisterService
  ]
})
export class RegisterModule {
  static routes = routes;
}
