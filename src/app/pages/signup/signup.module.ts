
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { SignupService } from './signup.service';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import { SignupComponent } from './signup.component';
import { VerfiedOTPComponent } from './verfied-otp/verfied-otp.component';
import { IApplyCommonModule } from '../iapply.common.module';
export const routes = [
  {path: '', component: SignupComponent, pathMatch: 'full'},
  {path: 'signup/VerfiedOTP', component: VerfiedOTPComponent},
  {path: 'signup/ResendOTP', component: VerfiedOTPComponent}
];

@NgModule({
  declarations: [ SignupComponent  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NewWidgetModule,
    AlertModule.forRoot(),
    ReactiveFormsModule,
    ModalModule,
    IApplyCommonModule

  ],
  // providers: [
  //   SignupService
  // ]
})
export class SignupModule {
  static routes = routes;
}
