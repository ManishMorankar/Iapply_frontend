import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionAdminReportComponent } from './subscription-admin-report.component';

describe('SubscriptionAdminReportComponent', () => {
  let component: SubscriptionAdminReportComponent;
  let fixture: ComponentFixture<SubscriptionAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionAdminReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
