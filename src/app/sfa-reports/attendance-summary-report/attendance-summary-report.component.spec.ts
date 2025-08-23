import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSummaryReportComponent } from './attendance-summary-report.component';

describe('AttendanceSummaryReportComponent', () => {
  let component: AttendanceSummaryReportComponent;
  let fixture: ComponentFixture<AttendanceSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
