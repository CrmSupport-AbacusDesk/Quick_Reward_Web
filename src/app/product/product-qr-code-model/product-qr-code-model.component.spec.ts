import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQrCodeModelComponent } from './product-qr-code-model.component';

describe('ProductQrCodeModelComponent', () => {
  let component: ProductQrCodeModelComponent;
  let fixture: ComponentFixture<ProductQrCodeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductQrCodeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQrCodeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
