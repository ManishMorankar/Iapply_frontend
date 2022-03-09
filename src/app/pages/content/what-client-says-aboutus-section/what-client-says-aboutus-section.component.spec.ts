import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatClientSaysAboutusSectionComponent } from './what-client-says-aboutus-section.component';

describe('WhatClientSaysAboutusSectionComponent', () => {
  let component: WhatClientSaysAboutusSectionComponent;
  let fixture: ComponentFixture<WhatClientSaysAboutusSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatClientSaysAboutusSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatClientSaysAboutusSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
