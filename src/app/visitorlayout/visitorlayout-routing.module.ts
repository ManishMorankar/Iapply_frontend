import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleDetailsComponent } from '../pages/article-details/article-details.component';
import { ArticlesComponent } from '../pages/articles/articles.component';
import { ContactUsComponent } from '../pages/contact-us/contact-us.component';
import { FaqComponent } from '../pages/faq/faq.component';
import { HomeComponent } from '../pages/home/home.component';
import { PrivacyPolicyComponent } from '../pages/privacy-policy/privacy-policy.component';
import { SitemappageComponent } from '../pages/sitemappage/sitemappage.component'
import { TermsAndConditionsComponent } from '../pages/terms-and-conditions/terms-and-conditions.component';

// TO_DO - CAN BE DELETED - AFTER TEST
const routes: Routes = [

    { path: 'home', component: HomeComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'faqs', component: FaqComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'SiteMap', component:  SitemappageComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'blogs', component: ArticlesComponent },
    { path: 'Articles/:id', component: ArticleDetailsComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full'},


  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorlayoutRoutingModule { }
