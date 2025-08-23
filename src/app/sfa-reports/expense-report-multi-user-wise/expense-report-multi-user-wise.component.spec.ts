import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseReportMultiUserWiseComponent } from './expense-report-multi-user-wise.component';

describe('ExpenseReportMultiUserWiseComponent', () => {
  let component: ExpenseReportMultiUserWiseComponent;
  let fixture: ComponentFixture<ExpenseReportMultiUserWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseReportMultiUserWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportMultiUserWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
