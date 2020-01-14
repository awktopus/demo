import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilingstatuspopupComponent } from './filingstatuspopup.component';

describe('FilingstatuspopupComponent', () => {
  let component: FilingstatuspopupComponent;
  let fixture: ComponentFixture<FilingstatuspopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilingstatuspopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilingstatuspopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
