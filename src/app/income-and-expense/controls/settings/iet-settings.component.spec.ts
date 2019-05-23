import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeExpenseSettingsComponent } from './iet-settings.component';

describe('HistoryComponent', () => {
  let component: IncomeExpenseSettingsComponent;
  let fixture: ComponentFixture<IncomeExpenseSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeExpenseSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeExpenseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
