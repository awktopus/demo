import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IetPdfPopupComponent } from './iet-pdf-popup.component';

describe('IetPdfPopupComponent', () => {
  let component: IetPdfPopupComponent;
  let fixture: ComponentFixture<IetPdfPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IetPdfPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IetPdfPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
