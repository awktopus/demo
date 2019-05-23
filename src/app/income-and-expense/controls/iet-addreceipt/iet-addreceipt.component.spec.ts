import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IetAddreceiptComponent } from './iet-addreceipt.component';

describe('IetAddreceiptComponent', () => {
  let component: IetAddreceiptComponent;
  let fixture: ComponentFixture<IetAddreceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IetAddreceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IetAddreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
