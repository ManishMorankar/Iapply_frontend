import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionmissionComponent } from './visionmission.component';

describe('VisionmissionComponent', () => {
  let component: VisionmissionComponent;
  let fixture: ComponentFixture<VisionmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisionmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
