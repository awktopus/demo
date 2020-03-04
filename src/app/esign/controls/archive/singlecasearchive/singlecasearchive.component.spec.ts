import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglecasearchiveComponent } from './singlecasearchive.component';

describe('SinglecasearchiveComponent', () => {
  let component: SinglecasearchiveComponent;
  let fixture: ComponentFixture<SinglecasearchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglecasearchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglecasearchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
