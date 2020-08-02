import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddupdatesignersComponent } from './addupdatesigners.component';

describe('AddupdatesignersComponent', () => {
  let component: AddupdatesignersComponent;
  let fixture: ComponentFixture<AddupdatesignersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddupdatesignersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddupdatesignersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
