import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndivisualAttendanceReportComponent } from './indivisual-attendance-report.component';

describe('IndivisualAttendanceReportComponent', () => {
  let component: IndivisualAttendanceReportComponent;
  let fixture: ComponentFixture<IndivisualAttendanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndivisualAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndivisualAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
