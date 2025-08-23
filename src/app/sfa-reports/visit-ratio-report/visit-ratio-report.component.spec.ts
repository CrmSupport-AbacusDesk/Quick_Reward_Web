import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitRatioReportComponent } from './visit-ratio-report.component';

describe('VisitRatioReportComponent', () => {
  let component: VisitRatioReportComponent;
  let fixture: ComponentFixture<VisitRatioReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitRatioReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitRatioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
