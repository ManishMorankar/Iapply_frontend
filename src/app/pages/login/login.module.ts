import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {AlertModule} from 'ngx-bootstrap';
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const routes = [
  { path: 'admin', component: AdminLoginComponent, pathMatch: 'full' },
  { path: '', component: LoginComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    LoginComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NewWidgetModule,
    AlertModule.forRoot(),
    ReactiveFormsModule
  ]
})
export class LoginModule {
  static routes = routes;
}
