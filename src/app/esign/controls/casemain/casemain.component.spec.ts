import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasemainComponent } from './casemain.component';

describe('NewcasemainComponent', () => {
  let component: CasemainComponent;
  let fixture: ComponentFixture<CasemainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasemainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasemainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
