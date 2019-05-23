import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1panelComponent } from './step1panel.component';

describe('Step1panelComponent', () => {
  let component: Step1panelComponent;
  let fixture: ComponentFixture<Step1panelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step1panelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step1panelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
