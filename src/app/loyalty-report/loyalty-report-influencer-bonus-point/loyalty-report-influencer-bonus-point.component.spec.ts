import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportInfluencerBonusPointComponent } from './loyalty-report-influencer-bonus-point.component';

describe('LoyaltyReportInfluencerBonusPointComponent', () => {
  let component: LoyaltyReportInfluencerBonusPointComponent;
  let fixture: ComponentFixture<LoyaltyReportInfluencerBonusPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportInfluencerBonusPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportInfluencerBonusPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
