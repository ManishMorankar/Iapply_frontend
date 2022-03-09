import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-subscription-report',
  templateUrl: './subscription-report.component.html',
  styleUrls: ['./subscription-report.component.scss']
})
export class SubscriptionReportComponent implements OnInit {
  subscriptionList: any = [];
  
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // this.getJobSubscriptionList();
  }

  getJobSubscriptionList() {
    this.apiService.get('User_Details')
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.subscriptionList = data.result;
        }
      })
  }


}
