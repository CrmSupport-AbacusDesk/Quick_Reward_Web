import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailExpenseComponent } from './detail-expense.component';

describe('DetailExpenseComponent', () => {
  let component: DetailExpenseComponent;
  let fixture: ComponentFixture<DetailExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
