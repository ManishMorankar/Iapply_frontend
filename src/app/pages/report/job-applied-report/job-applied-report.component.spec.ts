import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAppliedReportComponent } from './job-applied-report.component';

describe('JobAppliedReportComponent', () => {
  let component: JobAppliedReportComponent;
  let fixture: ComponentFixture<JobAppliedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAppliedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAppliedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
