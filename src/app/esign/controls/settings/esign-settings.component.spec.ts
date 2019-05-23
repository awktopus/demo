import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EsignSettingsComponent } from './esign-settings.component';

describe('HistoryComponent', () => {
  let component: EsignSettingsComponent;
  let fixture: ComponentFixture<EsignSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsignSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
