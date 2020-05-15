import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzsignPdfPopupComponent } from './ezsign-pdf-popup.component';

describe('EzsignPdfPopupComponent', () => {
  let component: EzsignPdfPopupComponent;
  let fixture: ComponentFixture<EzsignPdfPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignPdfPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignPdfPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
