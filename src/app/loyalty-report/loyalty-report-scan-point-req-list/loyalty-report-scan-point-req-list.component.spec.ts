import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportScanPointReqListComponent } from './loyalty-report-scan-point-req-list.component';

describe('LoyaltyReportScanPointReqListComponent', () => {
  let component: LoyaltyReportScanPointReqListComponent;
  let fixture: ComponentFixture<LoyaltyReportScanPointReqListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportScanPointReqListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportScanPointReqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
