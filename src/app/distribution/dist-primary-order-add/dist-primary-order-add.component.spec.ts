import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistPrimaryOrderAddComponent } from './dist-primary-order-add.component';

describe('DistPrimaryOrderAddComponent', () => {
  let component: DistPrimaryOrderAddComponent;
  let fixture: ComponentFixture<DistPrimaryOrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistPrimaryOrderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistPrimaryOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
