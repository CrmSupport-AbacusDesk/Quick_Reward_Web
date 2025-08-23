import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinReportMultiUserWiseComponent } from './checkin-report-multi-user-wise.component';

describe('CheckinReportMultiUserWiseComponent', () => {
  let component: CheckinReportMultiUserWiseComponent;
  let fixture: ComponentFixture<CheckinReportMultiUserWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinReportMultiUserWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinReportMultiUserWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
