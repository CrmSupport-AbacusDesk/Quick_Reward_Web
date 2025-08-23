import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignQtyComponent } from './assign-qty.component';

describe('AssignQtyComponent', () => {
  let component: AssignQtyComponent;
  let fixture: ComponentFixture<AssignQtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignQtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
