import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhereWeGoForJobsSubsectionComponent } from './where-we-go-for-jobs-subsection.component';

describe('WhereWeGoForJobsSubsectionComponent', () => {
  let component: WhereWeGoForJobsSubsectionComponent;
  let fixture: ComponentFixture<WhereWeGoForJobsSubsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhereWeGoForJobsSubsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhereWeGoForJobsSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
