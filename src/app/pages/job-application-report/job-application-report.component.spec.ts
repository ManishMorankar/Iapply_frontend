import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationReportComponent } from './job-application-report.component';

describe('JobApplicationReportComponent', () => {
  let component: JobApplicationReportComponent;
  let fixture: ComponentFixture<JobApplicationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobApplicationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
