import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSigningComponent } from './docSigning.component';

describe('MycasesComponent', () => {
  let component: DocSigningComponent;
  let fixture: ComponentFixture<DocSigningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSigningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
