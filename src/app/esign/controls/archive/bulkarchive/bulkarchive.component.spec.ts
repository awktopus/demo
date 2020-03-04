import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkarchiveComponent } from './bulkarchive.component';

describe('BulkarchiveComponent', () => {
  let component: BulkarchiveComponent;
  let fixture: ComponentFixture<BulkarchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkarchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkarchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
