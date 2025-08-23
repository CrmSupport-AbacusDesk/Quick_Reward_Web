import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportMonthWiseScanComponent } from './loyalty-report-month-wise-scan.component';

describe('LoyaltyReportMonthWiseScanComponent', () => {
  let component: LoyaltyReportMonthWiseScanComponent;
  let fixture: ComponentFixture<LoyaltyReportMonthWiseScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportMonthWiseScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportMonthWiseScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
