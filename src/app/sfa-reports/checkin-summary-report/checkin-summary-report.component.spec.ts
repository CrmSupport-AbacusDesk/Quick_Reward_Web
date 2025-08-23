import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinSummaryReportComponent } from './checkin-summary-report.component';

describe('CheckinSummaryReportComponent', () => {
  let component: CheckinSummaryReportComponent;
  let fixture: ComponentFixture<CheckinSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
