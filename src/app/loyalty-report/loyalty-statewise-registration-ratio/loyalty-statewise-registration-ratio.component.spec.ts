import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyStatewiseRegistrationRatioComponent } from './loyalty-statewise-registration-ratio.component';

describe('LoyaltyStatewiseRegistrationRatioComponent', () => {
  let component: LoyaltyStatewiseRegistrationRatioComponent;
  let fixture: ComponentFixture<LoyaltyStatewiseRegistrationRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyStatewiseRegistrationRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyStatewiseRegistrationRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
