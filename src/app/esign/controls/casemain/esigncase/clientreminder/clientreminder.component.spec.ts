import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientreminderComponent } from './clientreminder.component';

describe('ClientreminderComponent', () => {
  let component: ClientreminderComponent;
  let fixture: ComponentFixture<ClientreminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientreminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientreminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
