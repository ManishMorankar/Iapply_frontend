import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import {AppInterceptor} from './app.interceptor';
import {LoginService} from './pages/login/login.service';
import {AppGuard} from './app.guard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PagesModule } from './pages/pages.module';
import { VisitorlayoutModule } from './visitorlayout/visitorlayout.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomerLayoutModule } from './customer-layout/customer-layout.module';
import { ExperienceDatePipe } from './pipes/ExperienceDate';
import { PendingChangesGuard } from './pending-changes.guard';
import { ConfirmationLeaveComponent } from './confirmation-leave/confirmation-leave.component';
import { DatePipe } from '@angular/common';
//import {PasswordStrengthComponent } from './pages/password-strength/password-strength.component'
import * as moment from 'moment';

providers: [{  }]
const APP_PROVIDERS = [
  AppConfig,
  LoginService,
  AppGuard
];

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ExperienceDatePipe,
    ConfirmationLeaveComponent,
    //PasswordStrengthComponent
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(ROUTES, {
    useHash: false,
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy',
    scrollPositionRestoration: 'enabled', // or 'top'
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64], // [x, y] - adjust scroll offset
    onSameUrlNavigation: 'reload'}),
    PagesModule,
    VisitorlayoutModule,
    CKEditorModule,
    CustomerLayoutModule
  ],
  entryComponents: [ConfirmationLeaveComponent],
  providers: [
    PendingChangesGuard,
    DatePipe,
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true
    }
  ]
})
export class AppModule {}
