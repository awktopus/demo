import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2panelComponent } from './step2panel.component';

describe('Step2panelComponent', () => {
  let component: Step2panelComponent;
  let fixture: ComponentFixture<Step2panelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step2panelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step2panelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
