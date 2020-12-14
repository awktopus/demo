import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverustaxdocsComponent } from './receiverustaxdocs.component';

describe('ReceiverustaxdocsComponent', () => {
  let component: ReceiverustaxdocsComponent;
  let fixture: ComponentFixture<ReceiverustaxdocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverustaxdocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverustaxdocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
