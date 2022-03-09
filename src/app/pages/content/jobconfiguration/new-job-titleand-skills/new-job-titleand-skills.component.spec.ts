import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJobTitleandSkillsComponent } from './new-job-titleand-skills.component';

describe('NewJobTitleandSkillsComponent', () => {
  let component: NewJobTitleandSkillsComponent;
  let fixture: ComponentFixture<NewJobTitleandSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewJobTitleandSkillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewJobTitleandSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
