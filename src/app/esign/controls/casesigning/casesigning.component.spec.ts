import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSigningComponent } from './casesigning.component';

describe('CaseagreementComponent', () => {
  let component: CaseSigningComponent;
  let fixture: ComponentFixture<CaseSigningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseSigningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
