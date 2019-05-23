import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnotepopupComponent } from './addnotepopup.component';

describe('AddnotepopupComponent', () => {
  let component: AddnotepopupComponent;
  let fixture: ComponentFixture<AddnotepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnotepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnotepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
