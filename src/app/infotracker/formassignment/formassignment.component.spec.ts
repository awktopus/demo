import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormassignmentComponent } from './formassignment.component';

describe('FormassignmentComponent', () => {
  let component: FormassignmentComponent;
  let fixture: ComponentFixture<FormassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
