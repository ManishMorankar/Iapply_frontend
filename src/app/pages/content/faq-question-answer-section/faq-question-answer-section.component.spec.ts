import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqQuestionAnswerSectionComponent } from './faq-question-answer-section.component';

describe('FaqQuestionAnswerSectionComponent', () => {
  let component: FaqQuestionAnswerSectionComponent;
  let fixture: ComponentFixture<FaqQuestionAnswerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqQuestionAnswerSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqQuestionAnswerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
