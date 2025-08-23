import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInvoiceAddComponent } from './service-invoice-add.component';

describe('ServiceInvoiceAddComponent', () => {
  let component: ServiceInvoiceAddComponent;
  let fixture: ComponentFixture<ServiceInvoiceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceInvoiceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInvoiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
