import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseformviewComponent } from './caseformview.component';

describe('CaseformviewComponent', () => {
  let component: CaseformviewComponent;
  let fixture: ComponentFixture<CaseformviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseformviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseformviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
