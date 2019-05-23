import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditpopupComponent } from './auditpopup.component';

describe('AddnotepopupComponent', () => {
  let component: AuditpopupComponent;
  let fixture: ComponentFixture<AuditpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
