import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsigncaseComponent } from './esigncase.component';

describe('EsigncaseComponent', () => {
  let component: EsigncaseComponent;
  let fixture: ComponentFixture<EsigncaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsigncaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsigncaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
