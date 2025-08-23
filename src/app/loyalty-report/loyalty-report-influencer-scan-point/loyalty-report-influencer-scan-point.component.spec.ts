import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportInfluencerScanPointComponent } from './loyalty-report-influencer-scan-point.component';

describe('LoyaltyReportInfluencerScanPointComponent', () => {
  let component: LoyaltyReportInfluencerScanPointComponent;
  let fixture: ComponentFixture<LoyaltyReportInfluencerScanPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportInfluencerScanPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportInfluencerScanPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
