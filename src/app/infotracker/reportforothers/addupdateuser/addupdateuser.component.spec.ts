import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddupdateuserComponent } from './addupdateuser.component';

describe('AddupdateuserComponent', () => {
  let component: AddupdateuserComponent;
  let fixture: ComponentFixture<AddupdateuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddupdateuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddupdateuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
