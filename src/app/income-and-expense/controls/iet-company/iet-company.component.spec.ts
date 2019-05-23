import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IetCompanyComponent } from './iet-company.component';

describe('IetCompanyComponent', () => {
  let component: IetCompanyComponent;
  let fixture: ComponentFixture<IetCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IetCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IetCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
