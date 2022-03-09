import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSubscriptionComponent } from './content-subscription.component';

describe('ContentSubscriptionComponent', () => {
  let component: ContentSubscriptionComponent;
  let fixture: ComponentFixture<ContentSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
