import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportCouponHistoryComponent } from './loyalty-report-coupon-history.component';

describe('LoyaltyReportCouponHistoryComponent', () => {
  let component: LoyaltyReportCouponHistoryComponent;
  let fixture: ComponentFixture<LoyaltyReportCouponHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportCouponHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportCouponHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
