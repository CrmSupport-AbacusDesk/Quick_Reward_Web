import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintVisitListComponent } from './complaint-visit-list.component';

describe('ComplaintVisitListComponent', () => {
  let component: ComplaintVisitListComponent;
  let fixture: ComponentFixture<ComplaintVisitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintVisitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintVisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
