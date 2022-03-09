import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline-payment-response',
  templateUrl: './offline-payment-response.component.html',
  styleUrls: ['./offline-payment-response.component.scss']
})
export class OfflinePaymentResponseComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  dashboard(){
      this.router.navigate(['customer/dashboard']);
  }
}
