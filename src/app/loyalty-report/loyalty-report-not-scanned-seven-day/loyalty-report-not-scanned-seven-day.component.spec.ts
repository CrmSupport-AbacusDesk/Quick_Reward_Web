import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportNotScannedSevenDayComponent } from './loyalty-report-not-scanned-seven-day.component';

describe('LoyaltyReportNotScannedSevenDayComponent', () => {
  let component: LoyaltyReportNotScannedSevenDayComponent;
  let fixture: ComponentFixture<LoyaltyReportNotScannedSevenDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportNotScannedSevenDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportNotScannedSevenDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
