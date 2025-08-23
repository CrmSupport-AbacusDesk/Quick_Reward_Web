import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkingReportComponent } from './user-working-report.component';

describe('UserWorkingReportComponent', () => {
  let component: UserWorkingReportComponent;
  let fixture: ComponentFixture<UserWorkingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWorkingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWorkingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
