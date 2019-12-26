import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfieldsComponent } from './addfields.component';

describe('AddfieldsComponent', () => {
  let component: AddfieldsComponent;
  let fixture: ComponentFixture<AddfieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
