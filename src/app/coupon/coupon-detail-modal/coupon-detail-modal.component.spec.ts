import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDetailModalComponent } from './coupon-detail-modal.component';

describe('CouponDetailModalComponent', () => {
  let component: CouponDetailModalComponent;
  let fixture: ComponentFixture<CouponDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
