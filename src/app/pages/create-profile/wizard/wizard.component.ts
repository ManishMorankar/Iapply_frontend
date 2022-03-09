import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../service/data.service';


@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

  step: any = "1";
  currentStep: any = "1";
  completedStep: any = "1";
  subscriptionStatus;

  constructor(private formBuilder: FormBuilder, private router: Router, private data: DataService) {
     
  }
  ngOnInit() {
    this.currentStep = localStorage.getItem('current-step');
    this.completedStep = localStorage.getItem('completed-steps');
    this.subscriptionStatus = localStorage.getItem("Sub_Status");

  
  }

  clickTab(stepValue) {
    this.step = stepValue;
    this.completedStep = localStorage.getItem('completed-steps');
    if (stepValue == 1) {
      this.data.changeMessage("active");
      this.router.navigate(['customer/MyProfile'], {});
    }

    if (stepValue == 2 && this.completedStep > 1) {
      this.data.changeMessage("active");
      localStorage.setItem('current-step', "2");
      this.router.navigate(['customer/personal-profile']);
    }

    if (stepValue == 3 && this.completedStep > 2) {
      this.data.changeMessage("active");
      localStorage.setItem('current-step', "3");
      this.router.navigate(['customer/experience']);
    }
    if (stepValue == 4 && this.completedStep > 3) {
      localStorage.setItem('current-step', "4");
      this.router.navigate(['customer/education'], {  });
    }
    if (stepValue == 5 && this.completedStep > 4) {
      localStorage.setItem('current-step', "5");
      this.router.navigate(['customer/other-details'], {  });
    }
    if (stepValue == 6 && this.completedStep > 5) {
      localStorage.setItem('current-step', "6");
      this.router.navigate(['customer/job-preference'], {  });
    }
    if (stepValue == 7 && this.completedStep > 6) {
      localStorage.setItem('current-step', "7");
      this.router.navigate(['customer/other-attachments'], {  });
    }
    if (stepValue == 8 && this.completedStep > 7) {
      localStorage.setItem('current-step', "8");
      this.router.navigate(['customer/review'], {  });
    }
    if (stepValue == 9 && this.completedStep > 8) {
      localStorage.setItem('current-step', "9");
      this.router.navigate(['customer/consent'], {  });
    }
    if (stepValue == 10 && this.completedStep > 9) {
      localStorage.setItem('current-step', "10");
      this.router.navigate(['customer/selectPlan'], {  });
    }

  }



}
