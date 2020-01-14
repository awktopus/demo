import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitesignersComponent } from './invitesigners.component';

describe('InvitesignersComponent', () => {
  let component: InvitesignersComponent;
  let fixture: ComponentFixture<InvitesignersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitesignersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitesignersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
