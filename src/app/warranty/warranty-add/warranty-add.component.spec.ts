import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyAddComponent } from './warranty-add.component';

describe('WarrantyAddComponent', () => {
  let component: WarrantyAddComponent;
  let fixture: ComponentFixture<WarrantyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
