import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerEsignatureComponent } from './infotracker-esignature.component';

describe('InfotrackerEsignatureComponent', () => {
  let component: InfotrackerEsignatureComponent;
  let fixture: ComponentFixture<InfotrackerEsignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerEsignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerEsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
