import { LogoutComponent } from './logout/logout.component';
import { PendingChangesGuard } from './../pending-changes.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from '../pages/customer-dashboard/customer-dashboard.component';
import { StandardUserDashboardComponent } from '../pages/standard-user-dashboard/standard-user-dashboard.component';
import { SettingComponent } from '../pages/setting/setting.component';
import { MyProfileComponent } from '../pages/create-profile/my-profile/my-profile.component';
import { PaymentHistoryComponent } from '../pages/payment-history/payment-history.component';
import { JobHistoryComponent } from '../pages/job-history/job-history.component';
//import { AddJobHistoryComponent } from '../pages/add-job-history/add-job-history.component';
//import { AddPaymentHistoryComponent } from '../pages/add-payment-history/add-payment-history.component';
import { ChatComponent } from '../pages/chat/chat.component';
import { UploadResumeComponent } from '../pages/create-profile/upload-resume/upload-resume.component';
import { PersonalProfileComponent } from '../pages/create-profile/personal-profile/personal-profile.component';
import { ExperienceComponent } from '../pages/create-profile/experience/experience.component';
import { EducationComponent } from '../pages/create-profile/education/education.component';
import { OtherDetailsComponent } from '../pages/create-profile/other-details/other-details.component';
import { JobPreferenceComponent } from '../pages/create-profile/job-preference/job-preference.component';
import { OtherAttachmentsComponent } from '../pages/create-profile/other-attachments/other-attachments.component';
import { ReviewComponent } from '../pages/create-profile/review/review.component';
import { ConsentComponent } from '../pages/create-profile/consent/consent.component';
import { WizardComponent } from '../pages/create-profile/wizard/wizard.component';
import { SelectplanComponent } from '../pages/create-profile/selectplan/selectplan.component';
import { PaymentResponseComponent } from '../pages/create-profile/payment-response/payment-response.component';
import { OfflinePaymentResponseComponent } from '../pages/create-profile/offline-payment-response/offline-payment-response.component';
import { AddCardComponent } from '../pages/create-profile/add-card/add-card.component';

const routes: Routes = [
    { path: 'dashboard', component:StandardUserDashboardComponent },
    { path: 'AccountSettings', component:SettingComponent },
    { path: 'MyProfile', component:MyProfileComponent },
    { path: 'PaymentHistory' , component:PaymentHistoryComponent },
    { path: 'JobHistory' , component:JobHistoryComponent },
    { path: 'Chat' , component:ChatComponent },
    { path: 'logout' , component:LogoutComponent },

  //Profile Component Routes
  { path: 'upload-resume', component: UploadResumeComponent},
  { path: 'personal-profile', component: PersonalProfileComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'experience', component: ExperienceComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'education', component: EducationComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'other-details', component: OtherDetailsComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'job-preference', component: JobPreferenceComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'other-attachments', component: OtherAttachmentsComponent},
  { path: 'review', component: ReviewComponent},
  { path: 'consent', component: ConsentComponent},
  { path: 'wizard-form', component: WizardComponent},
  { path: 'selectPlan', component: SelectplanComponent },
  { path: 'add-card', component: AddCardComponent },
  { path: 'payment-response', component: PaymentResponseComponent },
  { path: 'offline-payment-response', component: OfflinePaymentResponseComponent },

  //End of Profile Component Routes
   // { path: 'customer/add-Job-History' , component:AddJobHistoryComponent },
   // { path: 'customer/Update-Job-History' , component:AddJobHistoryComponent },
   // { path: 'customer/add-Payment-History' , component:AddPaymentHistoryComponent },
   // { path: 'customer/Update-Payment-History' , component:AddPaymentHistoryComponent },
    { path: 'my-profile', redirectTo: 'customer/my-profile', pathMatch: 'full' },
    { path: '', redirectTo: 'customer/standardPlanUserDashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerLayoutRoutingModule { }
