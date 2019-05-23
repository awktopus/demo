import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailpopupComponent } from './emailpopup.component';

describe('PdfpopupComponent', () => {
  let component: EmailpopupComponent;
  let fixture: ComponentFixture<EmailpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
