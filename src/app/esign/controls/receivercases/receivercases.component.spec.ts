import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivercasesComponent } from './receivercases.component';

describe('ReceivercasesComponent', () => {
  let component: ReceivercasesComponent;
  let fixture: ComponentFixture<ReceivercasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivercasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivercasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
