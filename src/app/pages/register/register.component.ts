import {Component, HostBinding} from '@angular/core';
import {RegisterService} from './register.service';
import {LoginService} from '../login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './register.template.html',
  styleUrls: [ './register.style.scss' ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  RegisterUser: any;
  CustomerId: any;
  loginUser: any;
  formData: any;
  ModifiedBy: any;
  EmailId: any;
  VerfiyOTPForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private router: Router,  private toastMsg: ToastrService,private apiService:ApiService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }

    this.registerForm = this.formBuilder.group({
      FirstName:['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      LastName:['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      MobileNumber:['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    });
    this.VerfiyOTPForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      otp:['', Validators.required],

    });
    if (localStorage.getItem("currentUser")) {
      this.RegisterUser = JSON.parse(localStorage.getItem("RegisterUser"));
      this.EmailId=this.RegisterUser.EmailId;
    }
    if (this.RegisterUser){
      this.attachFormData();
    }
    if (this.RegisterUser){
      this.attachFormDataVF();
    }
  }
  attachFormData() {
    this.registerForm.controls.EmailId.setValue(this.RegisterUser.emailId);
    this.registerForm.controls.FirstName.setValue(this.RegisterUser.firstName);
    this.registerForm.controls.LastName.setValue(this.RegisterUser.lastName);
    this.registerForm.controls.MobileNumber.setValue(this.RegisterUser.MobileNumber);
    this.RegisterUser.controls.Password.setValue(this.RegisterUser.Password);
  }
  attachFormDataVF() {
    this.VerfiyOTPForm.controls.EmailId.setValue(this.RegisterUser.EmailId);
    this.VerfiyOTPForm.controls.otp.setValue(this.RegisterUser.Otp);

  }
  get rf(){
    return this.registerForm.controls;
  }
  get vf(){
    return this.VerfiyOTPForm.controls;
  }

  // setStatus() {
  //   var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
  //   if (this.registerForm.controls.BirthDate.value >= today) {
  //     this.registerForm.controls.BirthDate.reset();
  //     this.toastMsg.error("Birth date must be less than today date");
  //   }

  // }

  onRegister(){
    this.submitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      let payload= {
        FirstName: this.registerForm.value.FirstName,
        LastName: this.registerForm.value.LastName,
        EmailId: this.registerForm.value.EmailId,
        MobileNumber: this.registerForm.value.MobileNumber,
        Password: this.registerForm.value.Password,

       }
       if(!this.RegisterUser)
       {
         payload['EmailId'] = this.registerForm.value.EmailId;
        this.apiService.post('CustomerAuntentication/Register', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            // localStorage.setItem('token', data.result.token)
            // localStorage.setItem('RegisterUser', JSON.stringify(data.result.user));
            console.log(localStorage.getItem('data.result'));
            localStorage.setItem('EmailId', this.registerForm.value.EmailId)

            this.toastMsg.success('Registration Data Save successfully, please Verfied the login');
            this.router.navigate(['/register/VerfiedOTP']);
            // localStorage.setItem('EmailId', data.result.EmailId)


          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Email id is already registered');
          }
        });
      }
      // else if (this.RegisterUser){
      //   payload['customerId'] = this.RegisterUser.customerId;
      //   this.apiService.put('Customer', payload).subscribe(data => {
      //     if (data.statusCode === '201' && data.result){
      //       this.toastMsg.success('User updated successfully');
      //       this.registerForm.reset();
      //       this.router.navigate(['app/registerUserDetails']);
      //     }
      //   }, err => {
      //     console.log(err.error)
      //     if (err.error){
      //       this.toastMsg.error('User update error');
      //     }
      //   });
      // }

    }


  }

  
  onBack(){
    this.router.navigate(['app/registerUserDetails']);
  }
  // onVerify(){
  //   this.submitted = true;
  //   console.log(this.VerfiyOTPForm.value);
  //   if (this.VerfiyOTPForm.valid) {
  //     let payload= {
  //       EmailId: this.VerfiyOTPForm.value.EmailId,
  //       otp: this.VerfiyOTPForm.value.otp
  //      }
  //       this.apiService.post('CustomerAuntentication/VerifyOtp', payload).subscribe(data => {
  //         if (data.statusCode === '201' && data.result){
  //            localStorage.setItem('token', data.result.token)
  //            localStorage.setItem('iApplyUser', JSON.stringify(data.result.user));
  //            this.toastMsg.success('OTP Verification Done Successfully, please login');
  //            this.router.navigate(['/login']);
  //         }
  //       }, err => {
  //         console.log(err.error)
  //         if (err.error){
  //           this.toastMsg.error('OTP Verfication Failed registered');
  //         }
  //       });
  //     }

  // }
  // GoToResendOTPPage()
  // {
  //   this.router.navigate(['/register/ResendOTP']);
  // }
  isPasswordMatch() {
    if (this.registerForm.value.Password === this.registerForm.value.ConfirmPassword) {
      return true;
    } else {
      return false;
    }
  }
}

