import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemStatusModalComponent } from './redeem-status-modal.component';

describe('RedeemStatusModalComponent', () => {
  let component: RedeemStatusModalComponent;
  let fixture: ComponentFixture<RedeemStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
