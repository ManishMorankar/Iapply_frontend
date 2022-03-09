import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationLeaveComponent } from './confirmation-leave.component';

describe('ConfirmationLeaveComponent', () => {
  let component: ConfirmationLeaveComponent;
  let fixture: ComponentFixture<ConfirmationLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
