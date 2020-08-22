import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzsignGridcolpopupComponent } from './ezsign-gridcolpopup.component';

describe('EzsignGridcolpopupComponent', () => {
  let component: EzsignGridcolpopupComponent;
  let fixture: ComponentFixture<EzsignGridcolpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignGridcolpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignGridcolpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
