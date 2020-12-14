import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePaperSignComponent } from './casepapersign.component';

describe('CaseagreementComponent', () => {
  let component: CasePaperSignComponent;
  let fixture: ComponentFixture<CasePaperSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasePaperSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePaperSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
