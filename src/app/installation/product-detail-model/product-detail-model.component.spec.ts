import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailModelComponent } from './product-detail-model.component';

describe('ProductDetailModelComponent', () => {
  let component: ProductDetailModelComponent;
  let fixture: ComponentFixture<ProductDetailModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
