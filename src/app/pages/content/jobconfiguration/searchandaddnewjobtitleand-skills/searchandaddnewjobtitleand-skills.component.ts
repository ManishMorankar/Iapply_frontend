import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-searchandaddnewjobtitleand-skills',
  templateUrl: './searchandaddnewjobtitleand-skills.component.html',
  styleUrls: ['./searchandaddnewjobtitleand-skills.component.scss']
})
export class SEARCHANDADDNEWJOBTITLEandSKILLSComponent implements OnInit {

  JobTitleForm: FormGroup;
  JobSkillsForm: FormGroup;
  JobTitle: any;
  JobLocation: any;
  iApplyUser: any;
  JobDetails;
  JobId;
  submitted;
  preferredJobTitleAllList: any;
  preferredSkillAllList: any;
  renInfo: any = [];
  Type: any;
  Content: any;
  constructor(private formBuilder: FormBuilder,private apiService: ApiService, private router: Router , private toastMsg: ToastrService,private activatedRoute: ActivatedRoute) { }

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
    this.getPreferredJobTitle();
    this.getPreferredSkills();
    this.activatedRoute.queryParams.subscribe(params => {
           this.Type= params.Type;
      this.Content = params.Content;
    }
    );
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
        Type: "job title",
        Content: this.JobTitleForm.value.Title,
        Status: "Approved",
        AddedBy: this.iApplyUser.userDetailsId
     }
        this.apiService.post('CustomerProfile/UpdateJobTitleSkill',payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('New JobTitle  Approved Successfully');
            this.JobTitleForm.reset();
          }
        }, error => {
          console.log(error)
          if (error){
            this.toastMsg.error('Job Title cannot be Approved');
          }
        });

      }
    }
    onReject(){
      this.submitted = true;
      console.log(this.JobTitleForm.value);
      if (this.JobTitleForm.valid) {
        let payload= {
          Type: "job title",
          Content: this.JobTitleForm.value.Title,
          Status: "Rejected",
          AddedBy: this.iApplyUser.userDetailsId
       }
          this.apiService.post('CustomerProfile/UpdateJobTitleSkill',payload).subscribe(data => {
            if (data.statusCode === '201' && data.result){
              this.toastMsg.success('New JobTitle  Rejected');
              this.JobTitleForm.reset();
            }
          }, error => {
            console.log(error)
            if (error){
              this.toastMsg.error('JobTitle cannot be Rejected');
            }
          });

        }
      }
    onSkillsSubmit(){
      this.submitted = true;
      console.log(this.JobSkillsForm.value);
      if (this.JobSkillsForm.valid) {
        let payload= {
          Type:"Skill",
          Content: this.JobSkillsForm.value.Skills,
          Status: "Approved",
          AddedBy: this.iApplyUser.userDetailsId
       }
          this.apiService.post('CustomerProfile/UpdateJobTitleSkill',payload).subscribe(data => {
            if (data.statusCode === '201' && data.result){
              this.toastMsg.success('New Skills  Approved Successfully');
              this.JobSkillsForm.reset();
            }
          }, error => {
            console.log(error)
            if (error){
              this.toastMsg.error('Skills cannot be Approved');
            }
          });

        }
        else {
          this.toastMsg.error('Skills cannot be Approved');
          return false;
        }
      }
      onSkillsReject(){
        this.submitted = true;
        console.log(this.JobSkillsForm.value);
        if (this.JobSkillsForm.valid) {
          let payload= {
            Type:"Skill",
            Content: this.JobSkillsForm.value.Skills,
            Status: "Rejected",
            AddedBy: this.iApplyUser.userDetailsId
         }
            this.apiService.post('CustomerProfile/UpdateJobTitleSkill',payload).subscribe(data => {
              if (data.statusCode === '201' && data.result){
                this.toastMsg.success('New Skills  Rejected');
                this.JobSkillsForm.reset();
              }
            }, error => {
              console.log(error)
              if (error){
                this.toastMsg.error('Skills cannot be Rejected');
              }
            });

          }
          else {
            this.toastMsg.error('Skills cannot be Rejected');
            return false;
          }
        }
      getPreferredJobTitle() {
        this.apiService.get('CustomerProfile/JobDetails')
          .subscribe(data => {
            if (data.statusCode === "201" && data.result) {
              this.preferredJobTitleAllList = data.result
            }
          })

    }
    getPreferredSkills() {
      this.apiService.get('CustomerProfile/SkillDetails')
        .subscribe(data => {
          if (data.statusCode === "201" && data.result) {
            this.preferredSkillAllList = data.result
          }
        })

  }
   resetForm(){
    this.JobTitleForm.reset();
  }
  AddNewJobTitleandSkills()
  {
    this.router.navigate(['app/NewJobTitleandSkills']);
  }
  resetSkillsForm()
  {
    this.JobSkillsForm.reset();
  }
  Return()
  {
    this.router.navigate(['app/JobConfiguration']);
  }
}
