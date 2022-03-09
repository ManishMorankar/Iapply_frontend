import {Component, HostBinding,ElementRef} from '@angular/core';
// import {RegisterService} from './register.service';
// import {LoginService} from '../login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-resend-otp',
  templateUrl: './resend-otp.component.html',
  styleUrls: ['./resend-otp.component.scss']
})
export class ResendOtpComponent {
  ResendOTPForm: FormGroup;
  submitted = false;
  RegisterUser: any;
  CustomerId: any;
  loginUser: any;
  formData: any;
  ModifiedBy: any;
  timer:any;


  constructor(private formBuilder: FormBuilder, private router: Router,  private toastMsg: ToastrService,private apiService:ApiService, private activatedRoute:ActivatedRoute,private elementRef: ElementRef) { }

  ngOnInit(): void {
    if (localStorage.getItem("currentUser")) {
      this.loginUser = JSON.parse(localStorage.getItem("currentUser"))
    }
    this.ResendOTPForm = this.formBuilder.group({
      EmailId: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
});
    if (localStorage.getItem("currentUser")) {
      this.RegisterUser = JSON.parse(localStorage.getItem("RegisterUser"))
    }
    if (this.RegisterUser){
      this.attachFormData();
    }
    var callDuration = this.elementRef.nativeElement.querySelector('#time');
    this.startTimer(callDuration);
  }
  attachFormData() {
    this.ResendOTPForm.controls.EmailId.setValue(this.RegisterUser.EmailId);
 }
  get rf(){
    return this.ResendOTPForm.controls;
  }
  onSubmit(){

    this.submitted = true;
    console.log(this.ResendOTPForm.value);
    if (this.ResendOTPForm.valid) {
      let payload= {
        EmailId: this.ResendOTPForm.value.EmailId
       }
        this.apiService.post('CustomerAuntentication/ResendOtp', payload).subscribe(data => {
          if (data.statusCode === '201' && data.result){
            this.toastMsg.success('OTP Send Done Successfully, please Verify OTP Login ');
            this.router.navigate(['/register/VerfiedOTP']);
          }
        }, err => {
          console.log(err.error)
          if (err.error){
            this.toastMsg.error('Email id is already registered');
          }
        });
      }

  }
  // callMyCount(){
  //   document.getElementById('timer').innerHTML ="06" + ":" + "00";
  //   var myTimer=setInterval(startTimer,10);

  //   function startTimer() {
  //     var presentTime = document.getElementById('timer').innerHTML;
  //     var timeArray = presentTime.split(/[:]+/);
  //     var m = parseInt(timeArray[0]);
  //     var s = checkSecond((parseInt(timeArray[1]) - 1));
  //     if(s==59){m=m-1}
  //     if(m<0 && s==59){alert("Timeout for otp");
  //                      clearTimeout(myTimer);}
  //     document.getElementById('timer').innerHTML =  m + ":" + s;

  //   }

  //   function checkSecond(sec) {
  //     if (sec < 10 && sec >= 0) {sec = "0" + sec};
  //     if (sec < 0) {sec = "59"};
  //     return sec;
  //   }
  // }

  startTimer(display) {
    var timer = 360;
    var minutes;
    var seconds;

    Observable.interval(1000).subscribe(x => {
        minutes = Math.floor(timer / 60);
        seconds = Math.floor(timer % 60);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        --timer;
        if (timer < 0) {
             console.log('timer is ended');
        }
    })
}
}


