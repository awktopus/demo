import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSecurityComponent } from './casesecurity.component';

describe('CaseagreementComponent', () => {
  let component: CaseSecurityComponent;
  let fixture: ComponentFixture<CaseSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
