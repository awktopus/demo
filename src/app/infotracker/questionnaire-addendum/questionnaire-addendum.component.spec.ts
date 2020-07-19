import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireAddendumComponent } from './questionnaire-addendum.component';

describe('QuestionnaireAddendumComponent', () => {
  let component: QuestionnaireAddendumComponent;
  let fixture: ComponentFixture<QuestionnaireAddendumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireAddendumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireAddendumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
