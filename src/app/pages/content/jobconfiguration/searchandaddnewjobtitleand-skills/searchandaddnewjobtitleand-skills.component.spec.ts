import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEARCHANDADDNEWJOBTITLEandSKILLSComponent } from './searchandaddnewjobtitleand-skills.component';

describe('SEARCHANDADDNEWJOBTITLEandSKILLSComponent', () => {
  let component: SEARCHANDADDNEWJOBTITLEandSKILLSComponent;
  let fixture: ComponentFixture<SEARCHANDADDNEWJOBTITLEandSKILLSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SEARCHANDADDNEWJOBTITLEandSKILLSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SEARCHANDADDNEWJOBTITLEandSKILLSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
