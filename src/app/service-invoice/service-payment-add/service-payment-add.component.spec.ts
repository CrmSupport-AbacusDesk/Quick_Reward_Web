import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePaymentAddComponent } from './service-payment-add.component';

describe('ServicePaymentAddComponent', () => {
  let component: ServicePaymentAddComponent;
  let fixture: ComponentFixture<ServicePaymentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePaymentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
