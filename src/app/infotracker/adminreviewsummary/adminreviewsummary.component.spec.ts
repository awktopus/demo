import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminreviewsummaryComponent } from './adminreviewsummary.component';

describe('AdminreviewsummaryComponent', () => {
  let component: AdminreviewsummaryComponent;
  let fixture: ComponentFixture<AdminreviewsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminreviewsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminreviewsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
