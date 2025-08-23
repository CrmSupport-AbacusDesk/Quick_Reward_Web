import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportInfluencerRedemptionComponent } from './loyalty-report-influencer-redemption.component';

describe('LoyaltyReportInfluencerRedemptionComponent', () => {
  let component: LoyaltyReportInfluencerRedemptionComponent;
  let fixture: ComponentFixture<LoyaltyReportInfluencerRedemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportInfluencerRedemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportInfluencerRedemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
