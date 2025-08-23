import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyReportStateWiseLoginAgeingComponent } from './loyalty-report-state-wise-login-ageing.component';

describe('LoyaltyReportStateWiseLoginAgeingComponent', () => {
  let component: LoyaltyReportStateWiseLoginAgeingComponent;
  let fixture: ComponentFixture<LoyaltyReportStateWiseLoginAgeingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyReportStateWiseLoginAgeingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyReportStateWiseLoginAgeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
