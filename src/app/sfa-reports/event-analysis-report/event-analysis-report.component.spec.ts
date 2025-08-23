import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAnalysisReportComponent } from './event-analysis-report.component';

describe('EventAnalysisReportComponent', () => {
  let component: EventAnalysisReportComponent;
  let fixture: ComponentFixture<EventAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
