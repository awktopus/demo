import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerGridcolpopupComponent } from './infotracker-gridcolpopup.component';

describe('InfotrackerGridcolpopupComponent', () => {
  let component: InfotrackerGridcolpopupComponent;
  let fixture: ComponentFixture<InfotrackerGridcolpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerGridcolpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerGridcolpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
