import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfreportComponent } from './selfreport.component';

describe('SelfreportComponent', () => {
  let component: SelfreportComponent;
  let fixture: ComponentFixture<SelfreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
