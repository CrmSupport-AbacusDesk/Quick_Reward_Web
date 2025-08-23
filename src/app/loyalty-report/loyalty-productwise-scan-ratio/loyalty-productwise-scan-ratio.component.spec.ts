import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyProductwiseScanRatioComponent } from './loyalty-productwise-scan-ratio.component';

describe('LoyaltyProductwiseScanRatioComponent', () => {
  let component: LoyaltyProductwiseScanRatioComponent;
  let fixture: ComponentFixture<LoyaltyProductwiseScanRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyaltyProductwiseScanRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyProductwiseScanRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
