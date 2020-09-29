import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverezsigndocsComponent } from './receiverezsigndocs.component';

describe('ReceiverezsigndocsComponent', () => {
  let component: ReceiverezsigndocsComponent;
  let fixture: ComponentFixture<ReceiverezsigndocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverezsigndocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverezsigndocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
