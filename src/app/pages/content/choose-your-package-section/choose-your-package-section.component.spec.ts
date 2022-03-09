import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseYourPackageSectionComponent } from './choose-your-package-section.component';

describe('ChooseYourPackageSectionComponent', () => {
  let component: ChooseYourPackageSectionComponent;
  let fixture: ComponentFixture<ChooseYourPackageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseYourPackageSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseYourPackageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
