import { Routes } from '@angular/router';
import {AppGuard} from './app.guard';
import { VisitorlayoutComponent } from './visitorlayout/visitorlayout.component';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';


export const ROUTES: Routes = [{
   path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'customer', component:CustomerLayoutComponent, loadChildren: () => import('./customer-layout/customer-layout.module').then(m => m.CustomerLayoutModule)
  },
  {
    path: 'home', component:VisitorlayoutComponent, loadChildren: () => import('./visitorlayout/visitorlayout.module').then(m => m.VisitorlayoutModule)
  },
  {
    path: 'app', canActivate: [AppGuard],   loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
  },

  {
    path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'signup/VerfiedOTP', loadChildren: () => import('./pages/signup/verfied-otp/verfied-otp.component').then(m => m.VerfiedOTPComponent)
  },
  {
    path: 'user-management', loadChildren: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'create-profile', loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfileModule)
  },
  {
    path: 'blogs', loadChildren: () => import('./pages/articles/articles.component').then(m => m.ArticlesComponent)
  },
  {
    path: 'home', loadChildren: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'contact-us', loadChildren: () => import('./pages/contact-us/contact-us.component').then(m => m.ContactUsComponent)
  },
  {
    path: 'faqs', loadChildren: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'privacy-policy', loadChildren: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-and-conditions', loadChildren: () => import('./pages/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent)
  },
  {
    path: 'SiteMap', loadChildren: () => import('./pages/sitemappage/sitemappage.component').then(m => m.SitemappageComponent)
  },
];
