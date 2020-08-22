import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddguestsComponent } from './addguests.component';

describe('AddguestsComponent', () => {
  let component: AddguestsComponent;
  let fixture: ComponentFixture<AddguestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddguestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddguestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
