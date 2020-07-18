import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportforothersummaryComponent } from './reportforothersummary.component';

describe('ReportforothersummaryComponent', () => {
  let component: ReportforothersummaryComponent;
  let fixture: ComponentFixture<ReportforothersummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportforothersummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportforothersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
