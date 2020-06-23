import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddupdatelocationComponent } from './addupdatelocation.component';

describe('AddupdatelocationComponent', () => {
  let component: AddupdatelocationComponent;
  let fixture: ComponentFixture<AddupdatelocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddupdatelocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddupdatelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
