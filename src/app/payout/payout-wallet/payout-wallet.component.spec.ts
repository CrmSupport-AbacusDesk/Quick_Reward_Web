import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutWalletComponent } from './payout-wallet.component';

describe('PayoutWalletComponent', () => {
  let component: PayoutWalletComponent;
  let fixture: ComponentFixture<PayoutWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
