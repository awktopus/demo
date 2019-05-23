import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignerselectionComponent } from './signerselection.component';

describe('SignerselectionComponent', () => {
  let component: SignerselectionComponent;
  let fixture: ComponentFixture<SignerselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignerselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignerselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
