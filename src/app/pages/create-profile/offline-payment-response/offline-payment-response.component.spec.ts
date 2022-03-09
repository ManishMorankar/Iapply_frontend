import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePaymentResponseComponent } from './offline-payment-response.component';

describe('OfflinePaymentResponseComponent', () => {
  let component: OfflinePaymentResponseComponent;
  let fixture: ComponentFixture<OfflinePaymentResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflinePaymentResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePaymentResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
