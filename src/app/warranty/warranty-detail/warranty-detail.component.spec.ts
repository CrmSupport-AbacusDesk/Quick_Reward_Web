import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyDetailComponent } from './warranty-detail.component';

describe('WarrantyDetailComponent', () => {
  let component: WarrantyDetailComponent;
  let fixture: ComponentFixture<WarrantyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
