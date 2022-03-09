import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-job-titleand-skills',
  templateUrl: './new-job-titleand-skills.component.html',
  styleUrls: ['./new-job-titleand-skills.component.scss']
})
export class NewJobTitleandSkillsComponent implements OnInit {
  JobTitleForm: FormGroup;
  JobSkillsForm: FormGroup;
  JobTitle: any;
  JobLocation: any;
  iApplyUser: any;
  JobDetails;
  JobId;
  submitted;
  constructor(private formBuilder: FormBuilder,private apiService: ApiService, private router: Router , private toastMsg: ToastrService, private activatedRoute: ActivatedRoute) { }

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
    this.JobTitleForm = this.formBuilder.group({
      Title: ['', [Validators.required]]
    });

    this.JobSkillsForm = this.formBuilder.group({
      Skills: ['', [Validators.required]]
    });
  }
   get pSubmitted() {
    return this.JobTitleForm.controls;
   }
   get Submitted() {
    return this.JobSkillsForm.controls;
   }
   onSubmit(){
    this.submitted = true;
    console.log(this.JobTitleForm.value);
    if (this.JobTitleForm.valid) {
      let payload= {
        JobTitle: this.JobTitleForm.value.Title,
        Status: "Approved",
        AddedBy: this.iApplyUser.userDetailsId
     }
        this.apiService.post('CustomerProfile/AddJobTitle',payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('JobTitle Added Successfully');
            this.JobTitleForm.reset();
          }
        }, error => {
          console.log(error)
          if (error){
            this.toastMsg.error('JobTitle Already exits in the Database');
          }
        });

      }
    }
    onSkillsSubmit(){
      this.submitted = true;
      console.log(this.JobSkillsForm.value);
      if (this.JobSkillsForm.valid) {
        let payload= {
          SkillName: this.JobSkillsForm.value.Skills,
          Status: "Approved",
          AddedBy: this.iApplyUser.userDetailsId
       }
          this.apiService.post('CustomerProfile/AddSkill',payload).subscribe(data => {
            if (data.statusCode === '201' && data.result){
              this.toastMsg.success('New Skills  Added Successfully');
              this.JobSkillsForm.reset();
            }
          }, error => {
            console.log(error)
            if (error){
              this.toastMsg.error('Skill Already exits in the Database');
            }
          });

        }
      }
   resetForm(){
    this.JobTitleForm.reset();
  }
  AddNewJobTitleandSkills()
  {
    this.router.navigate(['app/NewJobTitleandSkills']);
  }
  Return()
  {
    this.router.navigate(['app/JobConfiguration']);
  }
}
