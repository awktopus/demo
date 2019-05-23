import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAnswerComponent } from './client-answer.component';

describe('ClientAnswerComponent', () => {
  let component: ClientAnswerComponent;
  let fixture: ComponentFixture<ClientAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
