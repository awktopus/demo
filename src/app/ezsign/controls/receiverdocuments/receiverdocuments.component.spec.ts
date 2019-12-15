import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverdocumentsComponent } from './receiverdocuments.component';

describe('ReceiverdocumentsComponent', () => {
  let component: ReceiverdocumentsComponent;
  let fixture: ComponentFixture<ReceiverdocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverdocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
