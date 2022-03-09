import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticlesComponent } from './articles/articles.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CreateProfileModule } from './create-profile/create-profile.module';

import { VerfiedOTPComponent } from './register/verfied-otp/verfied-otp.component';
import { ResendOtpComponent } from './register/resend-otp/resend-otp.component';
import { SitemappageComponent } from './sitemappage/sitemappage.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SubscribeSignUpComponent } from './subscribe-sign-up/subscribe-sign-up.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'faqs', component: FaqComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: 'blogs', component: ArticlesComponent },
  { path: 'Articles/:id', component: ArticleDetailsComponent },
  { path: 'SiteMap', component: SitemappageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'sign-up', component: SignupComponent },
  // { path: 'signup/VerfiedOTP',component:VerfiedOTPComponent },
  // { path: 'signup/ResendOTP',component:ResendOtpComponent },
  { path: 'signup/VerfiedOTP',component:VerfiedOTPComponent },
  { path: 'signup/ResendOTP',component:ResendOtpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'subscribe/sign-up', component: SubscribeSignUpComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes) ,CreateProfileModule],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
