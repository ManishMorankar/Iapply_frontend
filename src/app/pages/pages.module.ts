import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { ContentComponent } from './content/content.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ChatComponent } from './chat/chat.component';
import { ReportComponent } from './report/report.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NewWidgetModule } from '../layout/new-widget/widget.module';
import { AddInternalUserComponent } from './add-internal-user/add-internal-user.component';
import { HomeComponent } from './home/home.component';
import { AssociationsComponent } from './associations/associations.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ModalModule } from 'ngx-bootstrap';
import { ListTestimonialsComponent } from './list-testimonials/list-testimonials.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CreateProfileModule } from './create-profile/create-profile.module';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { RegisterdetailsComponent } from './registerdetails/registerdetails.component';
import { RegisterUpdateComponent } from './registerdetails/register-update/register-update.component';
import { ContentUpdateComponent } from './content/content-update/content-update.component';
import { ApproveJobSkillsComponent } from './content/content-update/approve-job-skills/approve-job-skills.component';
import { JobconfigurationComponent } from './content/jobconfiguration/jobconfiguration.component';
import { StandardUserDashboardComponent } from './standard-user-dashboard/standard-user-dashboard.component';
import { SettingComponent } from './setting/setting.component';
import { SubscriptionReportComponent } from './subscription-report/subscription-report.component';
import { JobApplicationReportComponent } from './job-application-report/job-application-report.component';
import { ContentAboutusComponent } from './content/aboutus/aboutus.component';
import { ContentHomeComponent} from './content/home/home.component';
import { ContentVisionmissionComponent } from './content/visionmission/visionmission.component';
import { ContentSubscriptionComponent } from './content/content-subscription/content-subscription.component';
import { ContentHomepageSectionComponent } from './content/content-homepage-section/content-homepage-section.component';
import { ContentPlatformInformationComponent } from './content/content-platform-information/content-platform-information.component';
import { PackageComponent } from './content/package/package.component';
import { WhoWeAreSectionComponent } from './content/who-we-are-section/who-we-are-section.component';
import { WhoWeAreSubSectionComponent } from './content/who-we-are-sub-section/who-we-are-sub-section.component';
import { WhoWeServeSectionComponent } from './content/who-we-serve-section/who-we-serve-section.component';
import { HowItWorksSectionComponent } from './content/how-it-works-section/how-it-works-section.component';
import { HowItWorksVideoSectionComponent } from './content/how-it-works-video-section/how-it-works-video-section.component';
import { FeaturesSectionComponent } from './content/features-section/features-section.component';
import { WhereWeGoForJobsSectionComponent } from './content/where-we-go-for-jobs-section/where-we-go-for-jobs-section.component';
import { WhereWeGoForJobsSubsectionComponent } from './content/where-we-go-for-jobs-subsection/where-we-go-for-jobs-subsection.component';
import { WhatClientSaysAboutusSectionComponent } from './content/what-client-says-aboutus-section/what-client-says-aboutus-section.component';
import { VideosSectionComponent } from './content/videos-section/videos-section.component';
import { ChooseYourPackageSectionComponent } from './content/choose-your-package-section/choose-your-package-section.component';
import { RecentArticlesSectionComponent } from './content/recent-articles-section/recent-articles-section.component';


import { FaqComponent } from './faq/faq.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FaqContentSectionComponent } from './content/faq-content-section/faq-content-section.component';
import { FaqQuestionAnswerSectionComponent } from './content/faq-question-answer-section/faq-question-answer-section.component';
import { PrivacyPolicySectionComponent } from './content/privacy-policy-section/privacy-policy-section.component';
import { TermsAndConditionsSectionComponent } from './content/terms-and-conditions-section/terms-and-conditions-section.component';
import { CookiesComponent } from './content/cookies/cookies.component';
import { SitemapComponent } from './content/sitemap/sitemap.component';
import { LetsTalkComponent } from './content/lets-talk/lets-talk.component';
import { WeAreSocialComponent } from './content/we-are-social/we-are-social.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { JobHistoryComponent } from './job-history/job-history.component';
//import { AddJobHistoryComponent } from './add-job-history/add-job-history.component';
//import { AddPaymentHistoryComponent } from './add-payment-history/add-payment-history.component';
import { ContactUsSectionComponent } from './content/contact-us-section/contact-us-section.component';
import { SitemappageComponent } from './sitemappage/sitemappage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SubscribeSignUpComponent } from './subscribe-sign-up/subscribe-sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IApplyCommonModule } from './iapply.common.module';
import { NewJobTitleandSkillsComponent } from './content/jobconfiguration/new-job-titleand-skills/new-job-titleand-skills.component';
import { SEARCHANDADDNEWJOBTITLEandSKILLSComponent } from './content/jobconfiguration/searchandaddnewjobtitleand-skills/searchandaddnewjobtitleand-skills.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ContentComponent,
    UserManagementComponent,
    ChatComponent,
    ReportComponent,
    AddInternalUserComponent,
    HomeComponent,
    AssociationsComponent,
    ContactUsComponent,
    ListTestimonialsComponent,
    CustomerDashboardComponent,
    CustomerProfileComponent,
    RegisterdetailsComponent,
    RegisterUpdateComponent,
    ContentUpdateComponent,
    ApproveJobSkillsComponent,
    JobconfigurationComponent,
    StandardUserDashboardComponent,
    SettingComponent,
    SubscriptionReportComponent,
    JobApplicationReportComponent,
    ContentAboutusComponent,
    ContentHomeComponent,
    ContentVisionmissionComponent,
    ContentSubscriptionComponent,
    ContentHomepageSectionComponent,
    ContentPlatformInformationComponent,
    PackageComponent,
    WhoWeAreSectionComponent,
    WhoWeAreSubSectionComponent,
    WhoWeServeSectionComponent,
    HowItWorksSectionComponent,
    HowItWorksVideoSectionComponent,
    FeaturesSectionComponent,
    WhereWeGoForJobsSectionComponent,
    WhereWeGoForJobsSubsectionComponent,
    WhatClientSaysAboutusSectionComponent,
    VideosSectionComponent,
    ChooseYourPackageSectionComponent,
    RecentArticlesSectionComponent,
    NewJobTitleandSkillsComponent,
    FaqComponent,
    TermsAndConditionsComponent,
    ArticlesComponent,
    ArticleDetailsComponent,
    PrivacyPolicyComponent,
    FaqContentSectionComponent,
    FaqQuestionAnswerSectionComponent,
    PrivacyPolicySectionComponent,
    TermsAndConditionsSectionComponent,
    CookiesComponent,
    SitemapComponent,
    LetsTalkComponent,
    WeAreSocialComponent,
    PaymentHistoryComponent,
    JobHistoryComponent,
    //AddJobHistoryComponent,
    //AddPaymentHistoryComponent,
    ContactUsSectionComponent,
    SitemappageComponent,
    ForgotPasswordComponent,
    SubscribeSignUpComponent,
    SEARCHANDADDNEWJOBTITLEandSKILLSComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    NgxDatatableModule,
    NewWidgetModule,
    ModalModule,
    CKEditorModule,
    CreateProfileModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    IApplyCommonModule
  ],
  providers:
  [
    DatePipe
  ]
})
export class PagesModule { }
