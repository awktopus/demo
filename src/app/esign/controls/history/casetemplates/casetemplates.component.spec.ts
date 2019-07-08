import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasetemplatesComponent } from './casetemplates.component';

describe('CasetemplatesComponent', () => {
  let component: CasetemplatesComponent;
  let fixture: ComponentFixture<CasetemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasetemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasetemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
