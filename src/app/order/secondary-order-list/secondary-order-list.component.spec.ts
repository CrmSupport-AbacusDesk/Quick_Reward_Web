import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryOrderListComponent } from './secondary-order-list.component';

describe('SecondaryOrderListComponent', () => {
  let component: SecondaryOrderListComponent;
  let fixture: ComponentFixture<SecondaryOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
