import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentArticlesSectionComponent } from './recent-articles-section.component';

describe('RecentArticlesSectionComponent', () => {
  let component: RecentArticlesSectionComponent;
  let fixture: ComponentFixture<RecentArticlesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentArticlesSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentArticlesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
