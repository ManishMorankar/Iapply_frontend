import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemappageComponent } from './sitemappage.component';

describe('SitemappageComponent', () => {
  let component: SitemappageComponent;
  let fixture: ComponentFixture<SitemappageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitemappageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemappageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
