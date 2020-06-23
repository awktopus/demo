import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerConfirmDialogComponent } from './infotracker-confirm-dialog.component';

describe('InfotrackerConfirmDialogComponent', () => {
  let component: InfotrackerConfirmDialogComponent;
  let fixture: ComponentFixture<InfotrackerConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
