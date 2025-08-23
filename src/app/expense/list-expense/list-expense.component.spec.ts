import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExpenseComponent } from './list-expense.component';

describe('ListExpenseComponent', () => {
  let component: ListExpenseComponent;
  let fixture: ComponentFixture<ListExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
