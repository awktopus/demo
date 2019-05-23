import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesigcapComponent } from './casesigcap.component';

describe('CasesigcapComponent', () => {
  let component: CasesigcapComponent;
  let fixture: ComponentFixture<CasesigcapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesigcapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesigcapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
