import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectplanComponent } from './selectplan.component';

describe('SelectplanComponent', () => {
  let component: SelectplanComponent;
  let fixture: ComponentFixture<SelectplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
