import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfotrackeragreementComponent } from './infotrackeragreement.component';

describe('InfotrackeragreementComponent', () => {
  let component: InfotrackeragreementComponent;
  let fixture: ComponentFixture<InfotrackeragreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfotrackeragreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfotrackeragreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
