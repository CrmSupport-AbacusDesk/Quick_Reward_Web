import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportSevenDaysNotScannedComponent } from './loyalty-report-seven-days-not-scanned.component';

describe('LoyaltyReportSevenDaysNotScannedComponent', () => {
  let component: LoyaltyReportSevenDaysNotScannedComponent;
  let fixture: ComponentFixture<LoyaltyReportSevenDaysNotScannedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportSevenDaysNotScannedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportSevenDaysNotScannedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
