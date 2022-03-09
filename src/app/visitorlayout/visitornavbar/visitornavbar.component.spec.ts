import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitornavbarComponent } from './visitornavbar.component';

describe('VisitornavbarComponent', () => {
  let component: VisitornavbarComponent;
  let fixture: ComponentFixture<VisitornavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitornavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitornavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
