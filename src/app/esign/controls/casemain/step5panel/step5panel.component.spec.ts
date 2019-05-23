import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5panelComponent } from './step5panel.component';

describe('Step5panelComponent', () => {
  let component: Step5panelComponent;
  let fixture: ComponentFixture<Step5panelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step5panelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step5panelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
