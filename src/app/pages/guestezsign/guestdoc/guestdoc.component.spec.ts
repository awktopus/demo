import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EzsignGuestDocComponent } from './guestdoc.component';

describe('EzsignGuestDocComponent', () => {
  let component: EzsignGuestDocComponent;
  let fixture: ComponentFixture<EzsignGuestDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzsignGuestDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzsignGuestDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
