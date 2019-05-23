import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfpopupComponent } from './pdfpopup.component';

describe('PdfpopupComponent', () => {
  let component: PdfpopupComponent;
  let fixture: ComponentFixture<PdfpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
