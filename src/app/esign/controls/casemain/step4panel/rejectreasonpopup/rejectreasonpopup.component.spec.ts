import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectreasonpopupComponent } from './rejectreasonpopup.component';

describe('RejectreasonpopupComponent', () => {
  let component: RejectreasonpopupComponent;
  let fixture: ComponentFixture<RejectreasonpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectreasonpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectreasonpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
