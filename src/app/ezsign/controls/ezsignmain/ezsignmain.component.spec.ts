import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzsignMainComponent } from './ezsignmain.component';

describe('SenderdocumentsComponent', () => {
  let component: EzsignMainComponent;
  let fixture: ComponentFixture<EzsignMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
