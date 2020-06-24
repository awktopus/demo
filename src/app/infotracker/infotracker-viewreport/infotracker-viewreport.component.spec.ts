import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerViewreportComponent } from './infotracker-viewreport.component';

describe('InfotrackerViewreportComponent', () => {
  let component: InfotrackerViewreportComponent;
  let fixture: ComponentFixture<InfotrackerViewreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerViewreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerViewreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
