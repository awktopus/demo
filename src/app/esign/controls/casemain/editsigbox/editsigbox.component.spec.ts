import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSigboxComponent } from './editsigbox.component';

describe('ClientreminderComponent', () => {
  let component: EditSigboxComponent;
  let fixture: ComponentFixture<EditSigboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSigboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSigboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
