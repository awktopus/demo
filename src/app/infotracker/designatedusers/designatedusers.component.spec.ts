import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignatedusersComponent } from './designatedusers.component';

describe('DesignatedusersComponent', () => {
  let component: DesignatedusersComponent;
  let fixture: ComponentFixture<DesignatedusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignatedusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignatedusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
