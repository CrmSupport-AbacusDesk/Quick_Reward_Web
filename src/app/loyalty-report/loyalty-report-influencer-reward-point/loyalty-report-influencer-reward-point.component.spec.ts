import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportInfluencerRewardPointComponent } from './loyalty-report-influencer-reward-point.component';

describe('LoyaltyReportInfluencerRewardPointComponent', () => {
  let component: LoyaltyReportInfluencerRewardPointComponent;
  let fixture: ComponentFixture<LoyaltyReportInfluencerRewardPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportInfluencerRewardPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportInfluencerRewardPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
