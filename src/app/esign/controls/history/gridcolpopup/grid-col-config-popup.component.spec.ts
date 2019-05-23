import { GridColConfigPopupComponent } from './grid-col-config-popup.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
describe('AddnotepopupComponent', () => {
  let component: GridColConfigPopupComponent;
  let fixture: ComponentFixture<GridColConfigPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridColConfigPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColConfigPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
