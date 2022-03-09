import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobconfigurationComponent } from './jobconfiguration.component';

describe('JobconfigurationComponent', () => {
  let component: JobconfigurationComponent;
  let fixture: ComponentFixture<JobconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobconfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
