import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportforothersComponent } from './reportforothers.component';

describe('ReportforothersComponent', () => {
  let component: ReportforothersComponent;
  let fixture: ComponentFixture<ReportforothersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportforothersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportforothersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
