import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainChartComponent } from './components/main-chart/main-chart.component';
import { BigStatComponent } from './components/big-stat/big-stat.component';

import 'jquery-flot/jquery.flot.js';
import 'jquery.flot.animator/jquery.flot.animator';
import 'jquery-flot/jquery.flot.pie.js';
import 'jquery-flot/jquery.flot.selection.js';
import 'jquery-flot/jquery.flot.resize.js';
import 'flot.dashes/jquery.flot.dashes';
import { WidgetModule } from '../../layout/widget/widget.module';
import {BsDropdownModule, ProgressbarModule} from 'ngx-bootstrap';
import {TrendModule} from 'ngx-trend';
import {TaskContainerComponent} from './components/task-container/task-container.component';
import {TaskComponent} from './components/task/task';
// import {CalendarModule} from '../visits/calendar/calendar.module';
import {DashboardService} from './dashboard.service';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WidgetModule,
    ProgressbarModule.forRoot(),
    TrendModule,
    BsDropdownModule.forRoot(),
    // CalendarModule,
    NewWidgetModule
  ],
  declarations: [
    MainChartComponent,
    BigStatComponent,
    TaskContainerComponent,
    TaskComponent],
  providers: [
    DashboardService
  ]
})
export class DashboardModule {
  static routes = routes;
 }
