import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UstaxPdfPopupComponent } from './ustax-pdf-popup.component';

describe('UstaxPdfPopupComponent', () => {
  let component: UstaxPdfPopupComponent;
  let fixture: ComponentFixture<UstaxPdfPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UstaxPdfPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UstaxPdfPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
