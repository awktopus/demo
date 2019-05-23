import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IetViewreportComponent } from './iet-viewreport.component';

describe('IetViewreportComponent', () => {
  let component: IetViewreportComponent;
  let fixture: ComponentFixture<IetViewreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IetViewreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IetViewreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
