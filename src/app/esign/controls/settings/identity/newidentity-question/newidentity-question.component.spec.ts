import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewidentityQuestionComponent } from './newidentity-question.component';

describe('NewidentityQuestionComponent', () => {
  let component: NewidentityQuestionComponent;
  let fixture: ComponentFixture<NewidentityQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewidentityQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewidentityQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
