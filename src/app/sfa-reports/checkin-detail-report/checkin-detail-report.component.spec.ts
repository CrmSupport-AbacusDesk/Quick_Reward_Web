import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinDetailReportComponent } from './checkin-detail-report.component';

describe('CheckinDetailReportComponent', () => {
  let component: CheckinDetailReportComponent;
  let fixture: ComponentFixture<CheckinDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
