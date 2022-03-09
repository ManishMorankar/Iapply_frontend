import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardUserDashboardComponent } from './standard-user-dashboard.component';

describe('StandardUserDashboardComponent', () => {
  let component: StandardUserDashboardComponent;
  let fixture: ComponentFixture<StandardUserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardUserDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
