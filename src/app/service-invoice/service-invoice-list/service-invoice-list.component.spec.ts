import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInvoiceListComponent } from './service-invoice-list.component';

describe('ServiceInvoiceListComponent', () => {
  let component: ServiceInvoiceListComponent;
  let fixture: ComponentFixture<ServiceInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
