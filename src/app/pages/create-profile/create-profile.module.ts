import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DropzoneDemoDirective } from '../../components/dropzone/dropzone.directive';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { UploadResumeComponent } from './upload-resume/upload-resume.component';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { ExperienceComponent } from './experience/experience.component';
import { EducationComponent } from './education/education.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { JobPreferenceComponent } from './job-preference/job-preference.component';
import { OtherAttachmentsComponent } from './other-attachments/other-attachments.component';
import { ReviewComponent } from './review/review.component';
import { ConsentComponent } from './consent/consent.component';
import { WizardComponent } from './wizard/wizard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SelectplanComponent } from './selectplan/selectplan.component';
import { PaymentResponseComponent } from './payment-response/payment-response.component';
import { OfflinePaymentResponseComponent } from './offline-payment-response/offline-payment-response.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddCardComponent } from './add-card/add-card.component';
@NgModule({
  declarations: [
    MyProfileComponent,
    UploadResumeComponent,
    PersonalProfileComponent,
    ExperienceComponent,
    EducationComponent,
    OtherDetailsComponent,
    JobPreferenceComponent,
    // DropzoneDemoDirective,
    OtherAttachmentsComponent,
    ReviewComponent,
    ConsentComponent,
    WizardComponent,
    SelectplanComponent,
    AddCardComponent,
    PaymentResponseComponent,
    OfflinePaymentResponseComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    CKEditorModule,
  ]
})
export class CreateProfileModule { }
