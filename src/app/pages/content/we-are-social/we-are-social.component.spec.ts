import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeAreSocialComponent } from './we-are-social.component';

describe('WeAreSocialComponent', () => {
  let component: WeAreSocialComponent;
  let fixture: ComponentFixture<WeAreSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeAreSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeAreSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
