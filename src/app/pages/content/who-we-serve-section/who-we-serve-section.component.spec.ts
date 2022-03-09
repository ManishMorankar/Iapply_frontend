import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWeServeSectionComponent } from './who-we-serve-section.component';

describe('WhoWeServeSectionComponent', () => {
  let component: WhoWeServeSectionComponent;
  let fixture: ComponentFixture<WhoWeServeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWeServeSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoWeServeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
