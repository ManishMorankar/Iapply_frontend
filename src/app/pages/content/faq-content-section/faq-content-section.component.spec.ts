import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqContentSectionComponent } from './faq-content-section.component';

describe('FaqContentSectionComponent', () => {
  let component: FaqContentSectionComponent;
  let fixture: ComponentFixture<FaqContentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqContentSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqContentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
