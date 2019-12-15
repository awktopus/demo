import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzsignComponent } from './ezsign.component';

describe('EzsignComponent', () => {
  let component: EzsignComponent;
  let fixture: ComponentFixture<EzsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
