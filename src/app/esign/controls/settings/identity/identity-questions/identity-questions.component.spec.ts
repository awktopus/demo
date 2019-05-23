import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityQuestionsComponent } from './identity-questions.component';

describe('IdentityQuestionsComponent', () => {
  let component: IdentityQuestionsComponent;
  let fixture: ComponentFixture<IdentityQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentityQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
