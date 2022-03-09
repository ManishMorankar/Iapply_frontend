import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksVideoSectionComponent } from './how-it-works-video-section.component';

describe('HowItWorksVideoSectionComponent', () => {
  let component: HowItWorksVideoSectionComponent;
  let fixture: ComponentFixture<HowItWorksVideoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksVideoSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksVideoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
