import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyUpdateModelComponent } from './warranty-update-model.component';

describe('WarrantyUpdateModelComponent', () => {
  let component: WarrantyUpdateModelComponent;
  let fixture: ComponentFixture<WarrantyUpdateModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyUpdateModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
