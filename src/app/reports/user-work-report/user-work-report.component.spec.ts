import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkReportComponent } from './user-work-report.component';

describe('UserWorkReportComponent', () => {
  let component: UserWorkReportComponent;
  let fixture: ComponentFixture<UserWorkReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWorkReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWorkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
