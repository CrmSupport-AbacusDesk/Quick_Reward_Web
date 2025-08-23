import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportStateKycStatusComponent } from './loyalty-report-state-kyc-status.component';

describe('LoyaltyReportStateKycStatusComponent', () => {
  let component: LoyaltyReportStateKycStatusComponent;
  let fixture: ComponentFixture<LoyaltyReportStateKycStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportStateKycStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportStateKycStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
