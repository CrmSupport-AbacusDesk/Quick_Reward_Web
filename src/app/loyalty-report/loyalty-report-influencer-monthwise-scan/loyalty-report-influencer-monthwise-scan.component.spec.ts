import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportInfluencerMonthwiseScanComponent } from './loyalty-report-influencer-monthwise-scan.component';

describe('LoyaltyReportInfluencerMonthwiseScanComponent', () => {
  let component: LoyaltyReportInfluencerMonthwiseScanComponent;
  let fixture: ComponentFixture<LoyaltyReportInfluencerMonthwiseScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportInfluencerMonthwiseScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportInfluencerMonthwiseScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
