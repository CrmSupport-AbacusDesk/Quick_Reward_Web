import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComplaintRemarkComponent } from './add-complaint-remark.component';

describe('AddComplaintRemarkComponent', () => {
  let component: AddComplaintRemarkComponent;
  let fixture: ComponentFixture<AddComplaintRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddComplaintRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComplaintRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
