import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3panelComponent } from './step3panel.component';

describe('Step3panelComponent', () => {
  let component: Step3panelComponent;
  let fixture: ComponentFixture<Step3panelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step3panelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step3panelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
