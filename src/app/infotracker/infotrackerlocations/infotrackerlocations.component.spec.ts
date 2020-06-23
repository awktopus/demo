import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackerlocationsComponent } from './infotrackerlocations.component';

describe('InfotrackerlocationsComponent', () => {
  let component: InfotrackerlocationsComponent;
  let fixture: ComponentFixture<InfotrackerlocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackerlocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackerlocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
