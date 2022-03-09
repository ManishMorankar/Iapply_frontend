import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhereWeGoForJobsSectionComponent } from './where-we-go-for-jobs-section.component';

describe('WhereWeGoForJobsSectionComponent', () => {
  let component: WhereWeGoForJobsSectionComponent;
  let fixture: ComponentFixture<WhereWeGoForJobsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhereWeGoForJobsSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhereWeGoForJobsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
