import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerPdfPopupComponent } from './infotracker-pdf-popup.component';

describe('InfotrackerPdfPopupComponent', () => {
  let component: InfotrackerPdfPopupComponent;
  let fixture: ComponentFixture<InfotrackerPdfPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerPdfPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerPdfPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
