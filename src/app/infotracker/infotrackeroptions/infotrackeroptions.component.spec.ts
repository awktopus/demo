import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackeroptionsComponent } from './infotrackeroptions.component';

describe('InfotrackeroptionsComponent', () => {
  let component: InfotrackeroptionsComponent;
  let fixture: ComponentFixture<InfotrackeroptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackeroptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackeroptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
