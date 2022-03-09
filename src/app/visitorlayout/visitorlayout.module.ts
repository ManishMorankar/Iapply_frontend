import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { VisitorlayoutComponent } from './visitorlayout.component';
import { VisitornavbarComponent } from './visitornavbar/visitornavbar.component';
import { VisitorlayoutRoutingModule } from './visitorlayout-routing.module';


const routes: Routes = [

];


@NgModule({
  declarations: [
    VisitorlayoutComponent,
    VisitornavbarComponent
  ],
  imports: [
    CommonModule,
    VisitorlayoutRoutingModule
  ]
})
export class VisitorlayoutModule { }
