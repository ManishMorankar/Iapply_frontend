import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlatformInformationComponent } from './content-platform-information.component';

describe('ContentPlatformInformationComponent', () => {
  let component: ContentPlatformInformationComponent;
  let fixture: ComponentFixture<ContentPlatformInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentPlatformInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlatformInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
