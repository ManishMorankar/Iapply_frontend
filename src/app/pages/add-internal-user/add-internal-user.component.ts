import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-add-internal-user',
  templateUrl: './add-internal-user.component.html',
  styleUrls: ['./add-internal-user.component.scss']
})
export class AddInternalUserComponent implements OnInit, OnDestroy {
  InternalUserForm: FormGroup;
  submitted = false;
  default_password = "------";
  internalUser;
  internalUser_id;
  currentUser;
  formData;
  iApplyUser;
  @Input() loginUser: any = {}

  constructor(private formBuilder: FormBuilder, private router: Router, private toastMsg: ToastrService, private apiService: ApiService, private activatedRoute: ActivatedRoute) { }

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
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }

    this.InternalUserForm = this.formBuilder.group({
      UserType:['', Validators.required],
      // UserName:['', Validators.required],
      FirstName:['', Validators.required],
      LastName:['', Validators.required],
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      Password: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)]],
      Status:['',Validators.required]
    });

    if (localStorage.getItem("iApplyUser") != 'null') {
      this.internalUser = JSON.parse(localStorage.getItem("internalUser"))
      this.internalUser_id=this.internalUser.userDetailsId;
    }
    if (this.internalUser){
      this.attachFormData();
    }
  }

  get uf(){
    return this.InternalUserForm.controls;
  }

  attachFormData(){
    this.InternalUserForm.controls.UserType.setValue(this.internalUser.userType);
    // this.InternalUserForm.controls.UserName.setValue(this.internalUser.firstName);
    this.InternalUserForm.controls.FirstName.setValue(this.internalUser.firstName);
    this.InternalUserForm.controls.LastName.setValue(this.internalUser.lastName);
     this.InternalUserForm.controls.EmailId.setValue(this.internalUser.emailId);
    this.InternalUserForm.controls.Password.setValue(this.default_password);
    this.InternalUserForm.controls.Status.setValue(this.internalUser.status);
  }


  /*setStatus() {
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    if (this.InternalUserForm.controls.BirthDate.value >= today) {
      this.InternalUserForm.controls.BirthDate.reset();
      this.toastMsg.error("Birth date must be less than today date");
    }

  }*/

  onSubmit(){
    this.submitted = true;
    console.log(this.InternalUserForm.value);
    if (this.InternalUserForm.valid) {
      let payload= {
        UserType: this.InternalUserForm.value.UserType,
        // UserName: this.InternalUserForm.value.UserName,
        FirstName: this.InternalUserForm.value.FirstName,
        LastName: this.InternalUserForm.value.LastName,
        EmailId: this.InternalUserForm.value.EmailId,
        Password: this.InternalUserForm.value.Password,
        Status: this.InternalUserForm.value.Status,
     }

      if (this.internalUser){
        payload['UserDetailsId'] = this.internalUser.userDetailsId;
        this.apiService.put('User_Details/UpdateUser', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('User updated successfully');
            this.router.navigate(['app/user-management']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('User update error');
          }
        });
      } else{
        this.apiService.post('User_Details/Register', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('User added successfully');
            this.router.navigate(['app/user-management']);
            this.InternalUserForm.reset();
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('User add error');
          }
        });

      }
    }
  }

  onBack(){
    this.router.navigate(['app/user-management']);
  }

  isPasswordMatch() {
    if (this.InternalUserForm.value.Password === this.InternalUserForm.value.ConfirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  resetForm(){
    this.InternalUserForm.reset();
  }

  ngOnDestroy() {
    localStorage.removeItem('internalUser');
  }

}
