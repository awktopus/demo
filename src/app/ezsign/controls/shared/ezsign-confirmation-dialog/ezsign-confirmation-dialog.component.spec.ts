import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzsignConfirmationDialogComponent } from './ezsign-confirmation-dialog.component';

describe('EzsignConfirmationDialogComponent', () => {
  let component: EzsignConfirmationDialogComponent;
  let fixture: ComponentFixture<EzsignConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
