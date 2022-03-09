import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-job-application-report',
  templateUrl: './job-application-report.component.html',
  styleUrls: ['./job-application-report.component.scss']
})
export class JobApplicationReportComponent implements OnInit {
  jobApplicationList: any = [];
  
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {

    // this.getJobApplicationList();
  }

  getJobApplicationList() {
    this.apiService.get('User_Details')
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.jobApplicationList = data.result;
        }
      })
  }

}
