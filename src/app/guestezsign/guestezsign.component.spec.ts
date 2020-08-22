import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestEzsignComponent } from './guestezsign.component';

describe('EzsignComponent', () => {
  let component: GuestEzsignComponent;
  let fixture: ComponentFixture<GuestEzsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestEzsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestEzsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
