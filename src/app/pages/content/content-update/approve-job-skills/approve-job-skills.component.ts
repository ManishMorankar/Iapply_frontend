import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../../../service/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-approve-job-skills',
  templateUrl: './approve-job-skills.component.html',
  styleUrls: ['./approve-job-skills.component.scss']
})
export class ApproveJobSkillsComponent implements OnInit {
  FormName: FormGroup;
  JobTitle: any;
  JobDetails: any = [];
  temp;
  currentUser;
  iApplyUser;
  pSubmitted;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  constructor(private formBuilder: FormBuilder,private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem("iApplyUser") != null) {
      this.iApplyUser = JSON.parse(localStorage.getItem("iApplyUser"));
      if (!this.apiService.checkPermission(this.iApplyUser.userType)) {
        this.router.navigate(['login']);
      }
    }
    else {
      this.router.navigate(['login']);
    }

    this.FormName = this.formBuilder.group({
      JobTitle: ['', [Validators.required]]
    });

    this.JobDetails();
  }

  getJobDetails() {
    this.apiService.get('')
      .subscribe(data => {
        if (data.statusCode === "201" && data.result) {
          this.JobDetails = data.result;
          this.temp = [...data.result];
        }
      })
  }
}
