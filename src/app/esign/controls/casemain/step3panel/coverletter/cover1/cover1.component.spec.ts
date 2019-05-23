import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cover1Component } from './cover1.component';

describe('Cover1Component', () => {
  let component: Cover1Component;
  let fixture: ComponentFixture<Cover1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cover1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cover1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
