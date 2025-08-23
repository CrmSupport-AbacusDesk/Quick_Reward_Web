import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportScanAgeingComponent } from './loyalty-report-scan-ageing.component';

describe('LoyaltyReportScanAgeingComponent', () => {
  let component: LoyaltyReportScanAgeingComponent;
  let fixture: ComponentFixture<LoyaltyReportScanAgeingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportScanAgeingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportScanAgeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
