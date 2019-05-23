import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasepdfComponent } from './casepdf.component';

describe('CasepdfComponent', () => {
  let component: CasepdfComponent;
  let fixture: ComponentFixture<CasepdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasepdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
