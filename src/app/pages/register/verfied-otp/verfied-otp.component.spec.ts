import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiedOTPComponent } from './verfied-otp.component';

describe('VerfiedOTPComponent', () => {
  let component: VerfiedOTPComponent;
  let fixture: ComponentFixture<VerfiedOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerfiedOTPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerfiedOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
