import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerComponent } from './infotracker.component';

describe('InfotrackerComponent', () => {
  let component: InfotrackerComponent;
  let fixture: ComponentFixture<InfotrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
