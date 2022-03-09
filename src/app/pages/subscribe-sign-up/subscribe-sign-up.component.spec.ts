import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeSignUpComponent } from './subscribe-sign-up.component';

describe('SubscribeSignUpComponent', () => {
  let component: SubscribeSignUpComponent;
  let fixture: ComponentFixture<SubscribeSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
