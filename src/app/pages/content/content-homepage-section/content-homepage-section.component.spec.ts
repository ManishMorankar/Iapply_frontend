import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentHomepageSectionComponent } from './content-homepage-section.component';

describe('ContentHomepageSectionComponent', () => {
  let component: ContentHomepageSectionComponent;
  let fixture: ComponentFixture<ContentHomepageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentHomepageSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentHomepageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
