import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWeAreSubSectionComponent } from './who-we-are-sub-section.component';

describe('WhoWeAreSubSectionComponent', () => {
  let component: WhoWeAreSubSectionComponent;
  let fixture: ComponentFixture<WhoWeAreSubSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWeAreSubSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoWeAreSubSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
