import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyScanRatioReportComponent } from './loyalty-scan-ratio-report.component';

describe('LoyaltyScanRatioReportComponent', () => {
  let component: LoyaltyScanRatioReportComponent;
  let fixture: ComponentFixture<LoyaltyScanRatioReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyScanRatioReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyScanRatioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
