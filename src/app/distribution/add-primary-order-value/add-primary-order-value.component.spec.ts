import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrimaryOrderValueComponent } from './add-primary-order-value.component';

describe('AddPrimaryOrderValueComponent', () => {
  let component: AddPrimaryOrderValueComponent;
  let fixture: ComponentFixture<AddPrimaryOrderValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPrimaryOrderValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrimaryOrderValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
