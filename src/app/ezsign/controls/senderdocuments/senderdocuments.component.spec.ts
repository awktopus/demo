import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderdocumentsComponent } from './senderdocuments.component';

describe('SenderdocumentsComponent', () => {
  let component: SenderdocumentsComponent;
  let fixture: ComponentFixture<SenderdocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderdocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
