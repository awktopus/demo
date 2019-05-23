import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4panelComponent } from './step4panel.component';

describe('Step4panelComponent', () => {
  let component: Step4panelComponent;
  let fixture: ComponentFixture<Step4panelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step4panelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step4panelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
