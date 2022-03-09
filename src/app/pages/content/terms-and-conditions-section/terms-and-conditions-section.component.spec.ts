import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsSectionComponent } from './terms-and-conditions-section.component';

describe('TermsAndConditionsSectionComponent', () => {
  let component: TermsAndConditionsSectionComponent;
  let fixture: ComponentFixture<TermsAndConditionsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
