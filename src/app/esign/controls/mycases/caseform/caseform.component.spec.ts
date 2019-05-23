import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseformComponent } from './caseform.component';

describe('CaseformComponent', () => {
  let component: CaseformComponent;
  let fixture: ComponentFixture<CaseformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
