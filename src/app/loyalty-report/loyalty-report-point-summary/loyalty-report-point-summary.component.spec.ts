import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportPointSummaryComponent } from './loyalty-report-point-summary.component';

describe('LoyaltyReportPointSummaryComponent', () => {
  let component: LoyaltyReportPointSummaryComponent;
  let fixture: ComponentFixture<LoyaltyReportPointSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportPointSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportPointSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
