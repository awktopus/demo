import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadscanpopupComponent } from './uploadscanpopup.component';

describe('UploadscanpopupComponent', () => {
  let component: UploadscanpopupComponent;
  let fixture: ComponentFixture<UploadscanpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadscanpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadscanpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
