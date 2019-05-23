import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseagreementComponent } from './caseagreement.component';

describe('CaseagreementComponent', () => {
  let component: CaseagreementComponent;
  let fixture: ComponentFixture<CaseagreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseagreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
