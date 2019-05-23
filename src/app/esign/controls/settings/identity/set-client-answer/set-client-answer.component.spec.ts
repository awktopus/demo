import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetClientAnswerComponent } from './set-client-answer.component';

describe('SetClientAnswerComponent', () => {
  let component: SetClientAnswerComponent;
  let fixture: ComponentFixture<SetClientAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetClientAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetClientAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
