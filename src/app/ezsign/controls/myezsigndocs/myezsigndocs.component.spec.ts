import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEzsignDocsComponent } from './myezsigndocs.component';

describe('MycasesComponent', () => {
  let component: MyEzsignDocsComponent;
  let fixture: ComponentFixture<MyEzsignDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEzsignDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEzsignDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
