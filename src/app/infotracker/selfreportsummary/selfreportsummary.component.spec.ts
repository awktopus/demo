import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfreportsummaryComponent } from './selfreportsummary.component';

describe('SelfreportsummaryComponent', () => {
  let component: SelfreportsummaryComponent;
  let fixture: ComponentFixture<SelfreportsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfreportsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfreportsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
