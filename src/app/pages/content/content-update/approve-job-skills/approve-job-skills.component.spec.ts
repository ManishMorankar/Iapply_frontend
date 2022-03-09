import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveJobSkillsComponent } from './approve-job-skills.component';

describe('ApproveJobSkillsComponent', () => {
  let component: ApproveJobSkillsComponent;
  let fixture: ComponentFixture<ApproveJobSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveJobSkillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveJobSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
