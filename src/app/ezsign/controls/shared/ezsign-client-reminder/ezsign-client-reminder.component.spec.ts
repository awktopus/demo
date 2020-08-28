import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzsignClientReminderComponent } from './ezsign-client-reminder.component';

describe('EzsignClientReminderComponent', () => {
  let component: EzsignClientReminderComponent;
  let fixture: ComponentFixture<EzsignClientReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignClientReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignClientReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
