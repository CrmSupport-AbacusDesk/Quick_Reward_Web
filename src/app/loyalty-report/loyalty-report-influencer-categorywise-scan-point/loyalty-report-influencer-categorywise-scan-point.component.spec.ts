import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportInfluencerCategorywiseScanPointComponent } from './loyalty-report-influencer-categorywise-scan-point.component';

describe('LoyaltyReportInfluencerCategorywiseScanPointComponent', () => {
  let component: LoyaltyReportInfluencerCategorywiseScanPointComponent;
  let fixture: ComponentFixture<LoyaltyReportInfluencerCategorywiseScanPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportInfluencerCategorywiseScanPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportInfluencerCategorywiseScanPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
