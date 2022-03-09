import { Routes, RouterModule } from '@angular/router';
import { AddInternalUserComponent } from '../pages/add-internal-user/add-internal-user.component';
import { ChatComponent } from '../pages/chat/chat.component';
import { ApproveJobSkillsComponent } from '../pages/content/content-update/approve-job-skills/approve-job-skills.component';
import { ContentUpdateComponent } from '../pages/content/content-update/content-update.component';
import { ContentComponent } from '../pages/content/content.component';
import { JobconfigurationComponent } from '../pages/content/jobconfiguration/jobconfiguration.component';
import { ConsentComponent } from '../pages/create-profile/consent/consent.component';
import { EducationComponent } from '../pages/create-profile/education/education.component';
import { ExperienceComponent } from '../pages/create-profile/experience/experience.component';
import { JobPreferenceComponent } from '../pages/create-profile/job-preference/job-preference.component';
import { MyProfileComponent } from '../pages/create-profile/my-profile/my-profile.component';
import { CustomerProfileComponent } from '../pages/customer-profile/customer-profile.component';
import { OtherAttachmentsComponent } from '../pages/create-profile/other-attachments/other-attachments.component';
import { OtherDetailsComponent } from '../pages/create-profile/other-details/other-details.component';
import { PersonalProfileComponent } from '../pages/create-profile/personal-profile/personal-profile.component';
import { ReviewComponent } from '../pages/create-profile/review/review.component';
import { UploadResumeComponent } from '../pages/create-profile/upload-resume/upload-resume.component';
import { WizardComponent } from '../pages/create-profile/wizard/wizard.component';
import { JobApplicationReportComponent } from '../pages/job-application-report/job-application-report.component';
import { ListTestimonialsComponent } from '../pages/list-testimonials/list-testimonials.component';
import { RegisterUpdateComponent } from '../pages/registerdetails/register-update/register-update.component';
import { RegisterdetailsComponent } from '../pages/registerdetails/registerdetails.component';
import { ReportComponent } from '../pages/report/report.component';
import { SettingComponent } from '../pages/setting/setting.component';
import { StandardUserDashboardComponent } from '../pages/standard-user-dashboard/standard-user-dashboard.component';
import { SubscriptionReportComponent } from '../pages/subscription-report/subscription-report.component';
import { PendingChangesGuard } from '../pending-changes.guard';
import { UserManagementComponent } from '../pages/user-management/user-management.component';
import { LayoutComponent } from './layout.component';
import { ContentAboutusComponent } from '../pages/content/aboutus/aboutus.component';
import { ContentHomeComponent } from '../pages/content/home/home.component';
import { ContentVisionmissionComponent } from '../pages/content/visionmission/visionmission.component';
import { ContentSubscriptionComponent } from '../pages/content/content-subscription/content-subscription.component';
import { ContentHomepageSectionComponent } from '../pages/content/content-homepage-section/content-homepage-section.component';
import { ContentPlatformInformationComponent } from '../pages/content/content-platform-information/content-platform-information.component';
import { PackageComponent } from '../pages/content/package/package.component';
import { WhoWeAreSectionComponent } from '../pages/content/who-we-are-section/who-we-are-section.component';
import { WhoWeAreSubSectionComponent } from '../pages/content/who-we-are-sub-section/who-we-are-sub-section.component';
import { WhoWeServeSectionComponent } from '../pages/content/who-we-serve-section/who-we-serve-section.component';
import { HowItWorksSectionComponent } from '../pages/content/how-it-works-section/how-it-works-section.component';
import { HowItWorksVideoSectionComponent } from '../pages/content/how-it-works-video-section/how-it-works-video-section.component';
import { FeaturesSectionComponent } from '../pages/content/features-section/features-section.component';
import { WhereWeGoForJobsSectionComponent } from '../pages/content/where-we-go-for-jobs-section/where-we-go-for-jobs-section.component';
import { WhereWeGoForJobsSubsectionComponent } from '../pages/content/where-we-go-for-jobs-subsection/where-we-go-for-jobs-subsection.component';
import { WhatClientSaysAboutusSectionComponent } from '../pages/content/what-client-says-aboutus-section/what-client-says-aboutus-section.component';
import { VideosSectionComponent } from '../pages/content/videos-section/videos-section.component';
import { ChooseYourPackageSectionComponent } from '../pages/content/choose-your-package-section/choose-your-package-section.component';
import { RecentArticlesSectionComponent } from '../pages/content/recent-articles-section/recent-articles-section.component';

import { FaqContentSectionComponent } from '../pages/content/faq-content-section/faq-content-section.component';
import { FaqQuestionAnswerSectionComponent } from '../pages/content/faq-question-answer-section/faq-question-answer-section.component';
import { PrivacyPolicySectionComponent } from '../pages/content/privacy-policy-section/privacy-policy-section.component';
import { TermsAndConditionsSectionComponent } from '../pages/content/terms-and-conditions-section/terms-and-conditions-section.component';
import { WeAreSocialComponent } from '../pages/content/we-are-social/we-are-social.component';
import { LetsTalkComponent } from '../pages/content/lets-talk/lets-talk.component';
import { CookiesComponent } from '../pages/content/cookies/cookies.component';
import { SitemapComponent } from '../pages/content/sitemap/sitemap.component';
import { PaymentHistoryComponent } from '../pages/payment-history/payment-history.component';
import { JobHistoryComponent } from '../pages/job-history/job-history.component';
//import { AddJobHistoryComponent } from '../pages/add-job-history/add-job-history.component';
//import { AddPaymentHistoryComponent } from '../pages/add-payment-history/add-payment-history.component';
import { ContactUsSectionComponent } from '../pages/content/contact-us-section/contact-us-section.component';
import { SelectplanComponent } from '../pages/create-profile/selectplan/selectplan.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { JobAppliedReportComponent } from '../pages/report/job-applied-report/job-applied-report.component';
import { PaymentReportComponent } from '../pages/report/payment-report/payment-report.component';
import { SupportReportComponent } from '../pages/report/support-report/support-report.component';
import { ErrorLogReportComponent } from '../pages/report/error-log-report/error-log-report.component';
// import { SubscriptionReportComponent } from '../pages/report/subscription-report/subscription-report.component';
import {SubscriptionAdminReportComponent} from '../pages/report/subscription-admin-report/subscription-admin-report.component';
import { NewJobTitleandSkillsComponent } from '../pages/content/jobconfiguration/new-job-titleand-skills/new-job-titleand-skills.component';
import { SEARCHANDADDNEWJOBTITLEandSKILLSComponent } from '../pages/content/jobconfiguration/searchandaddnewjobtitleand-skills/searchandaddnewjobtitleand-skills.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
     { path: 'dashboard', component: DashboardComponent},
      { path: 'content', component: ContentComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'add-internal-user', component: AddInternalUserComponent},
      { path: 'update-internal-user', component: AddInternalUserComponent},
      { path: 'chat', component: ChatComponent},
      { path: 'report', component: ReportComponent},
      { path: 'testimonial', component: ListTestimonialsComponent},
      { path: 'setting' , component: SettingComponent},
      { path: 'registerUserDetails', component: RegisterdetailsComponent},
      { path: 'registerupdate', component: RegisterUpdateComponent},
      //Standard User Dashboard
      { path: 'customer/standardPlanUserDashboard', component: StandardUserDashboardComponent},
      //Analytics
      { path: 'analytics/my-profile', component: MyProfileComponent},
      //Approved Content Update
      {path : 'contentUpdate' , component : ContentUpdateComponent},
      {path : 'ApprovedJob' , component : ApproveJobSkillsComponent},
      {path : 'JobConfiguration' , component : JobconfigurationComponent},
      // { path: 'my-profile', component: MyProfileComponent},
      // { path: 'upload-resume', component: UploadResumeComponent},
      // { path: 'personal-profile', component: PersonalProfileComponent},
      // { path: 'experience', component: ExperienceComponent},
      // { path: 'education', component: EducationComponent},
      // { path: 'other-details', component: OtherDetailsComponent},
      // { path: 'job-preference', component: JobPreferenceComponent},
      // { path: 'other-attachments', component: OtherAttachmentsComponent},
      // { path: 'review', component: ReviewComponent},
      // { path: 'consent', component: ConsentComponent},
      // { path: 'wizard-form', component: WizardComponent},
      // { path: 'SelectPlan', component: SelectplanComponent},

      { path: 'subscription-report', component: SubscriptionReportComponent},
      { path: 'job-application-report', component: JobApplicationReportComponent},
      { path: 'customer-profile', component: CustomerProfileComponent},

      // content update form pages
      { path: 'Home-update', component:ContentHomeComponent},
      { path: 'who-we-are-section', component: WhoWeAreSectionComponent },
      { path: 'who-we-are-sub-section', component: WhoWeAreSubSectionComponent },
      { path: 'who-we-serve-section', component: WhoWeServeSectionComponent },
      { path: 'how-it-works-section', component: HowItWorksSectionComponent },
      { path: 'how-it-works-video-section', component: HowItWorksVideoSectionComponent },
      { path: 'features-section', component: FeaturesSectionComponent },
      { path: 'where-we-go-for-job-section', component: WhereWeGoForJobsSectionComponent },
      { path: 'where-we-go-for-job-subsection', component: WhereWeGoForJobsSubsectionComponent },
      { path: 'what-client-says-aboutus-section', component: WhatClientSaysAboutusSectionComponent },
      { path: 'videos-section', component: VideosSectionComponent },
      { path: 'choose-your-package-section', component: ChooseYourPackageSectionComponent },
      { path: 'recent-articles-section', component: RecentArticlesSectionComponent },
      { path: 'faq-content-section', component: FaqContentSectionComponent },
      { path: 'faq-question-answer-section', component: FaqQuestionAnswerSectionComponent },
      { path: 'privacy-policy-section', component: PrivacyPolicySectionComponent },
      { path: 'terms-and-conditions-section', component: TermsAndConditionsSectionComponent },
      { path: 'we-are-social-section', component: WeAreSocialComponent },
      { path: 'lets-talk-section', component: LetsTalkComponent },
      { path: 'cookies-section', component: CookiesComponent },
      { path: 'sitemap-section', component: SitemapComponent },
      { path: 'Contact-Us-Section', component:ContactUsSectionComponent },
      // content update pages by Id
      { path: 'Home-update/:id', component:ContentHomeComponent},
      { path: 'who-we-are-section/:id', component: WhoWeAreSectionComponent },
      { path: 'who-we-are-sub-section/:id', component: WhoWeAreSubSectionComponent },
      { path: 'who-we-serve-section/:id', component: WhoWeServeSectionComponent },
      { path: 'how-it-works-section/:id', component: HowItWorksSectionComponent },
      { path: 'how-it-works-video-section/:id', component: HowItWorksVideoSectionComponent },
      { path: 'features-section/:id', component: FeaturesSectionComponent },
      { path: 'where-we-go-for-job-section/:id', component: WhereWeGoForJobsSectionComponent },
      { path: 'where-we-go-for-job-subsection/:id', component: WhereWeGoForJobsSubsectionComponent },
      { path: 'what-client-says-aboutus-section/:id', component: WhatClientSaysAboutusSectionComponent },
      { path: 'videos-section/:id', component: VideosSectionComponent },
      { path: 'choose-your-package-section/:id', component: ChooseYourPackageSectionComponent },
      { path: 'recent-articles-section/:id', component: RecentArticlesSectionComponent },
      { path: 'faq-content-section/:id', component: FaqContentSectionComponent },
      { path: 'faq-question-answer-section/:id', component: FaqQuestionAnswerSectionComponent },
      { path: 'privacy-policy-section/:id', component: PrivacyPolicySectionComponent },
      { path: 'terms-and-conditions-section/:id', component: TermsAndConditionsSectionComponent },
      { path: 'we-are-social-section', component: WeAreSocialComponent },
      { path: 'lets-talk-section/:id', component: LetsTalkComponent },
      { path: 'cookies-section/:id', component: CookiesComponent },
      { path: 'sitemap-section/:id', component: SitemapComponent },



      { path: 'subscription-update', component: ContentSubscriptionComponent },
      { path: 'about-us-update', component:ContentAboutusComponent},
      { path: 'VissionMisson-update', component:ContentVisionmissionComponent},
      { path: 'Home-sections-update', component: ContentHomepageSectionComponent },
      { path: 'platform-information-update', component: ContentPlatformInformationComponent },
      { path: 'package-update', component: PackageComponent },

      // content update html editor pages by Id
      { path: 'about-us-update/:id', component:ContentAboutusComponent},
      { path: 'VissionMisson-update/:id', component:ContentVisionmissionComponent},
      { path: 'Home-sections-update/:id', component: ContentHomepageSectionComponent },
      { path: 'platform-information-update/:id', component: ContentPlatformInformationComponent },
//Report by Admin Side

      { path: 'JobAppliedReport' , component:JobAppliedReportComponent},
      { path: 'PaymentReport' , component:PaymentReportComponent},
      // { path: 'SubscriptionReport' , component:SubscriptionsComponent },
      { path: 'SubscriptionReport' , component:SubscriptionAdminReportComponent},
      { path: 'SupportReport' , component:SupportReportComponent},
      { path: 'ErrorLogReport' , component:ErrorLogReportComponent},

//End Report By Admin Side
// New Component For Customer
{ path:'PaymentHistory' , component:PaymentHistoryComponent},
//{ path: 'add-Payment-History' , component : AddPaymentHistoryComponent},
//{ path: 'Update-Payment-History' , component : AddPaymentHistoryComponent},
{ path:'JobHistory' , component:JobHistoryComponent},
//{ path: 'add-Job-History' , component : AddJobHistoryComponent},
// { path: 'analytics' , component : AnalyticsComponent},
//{ path: 'Update-Job-History' , component : AddJobHistoryComponent},

{ path:'NewJobTitleandSkills' , component:NewJobTitleandSkillsComponent},
{ path:'SearchandAddNewJobTitleandSkills' , component:SEARCHANDADDNEWJOBTITLEandSKILLSComponent},

{ path: 'analytics', loadChildren: () => import('../pages/analytics/analytics.module').then(m => m.AnalyticsModule) },
    ]
  }
];

export const ROUTES = RouterModule.forChild(routes);
