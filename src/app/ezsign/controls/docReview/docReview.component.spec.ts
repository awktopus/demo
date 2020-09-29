import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReviewComponent } from './docReview.component';

describe('docReivewComponent', () => {
  let component: DocReviewComponent;
  let fixture: ComponentFixture<DocReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
