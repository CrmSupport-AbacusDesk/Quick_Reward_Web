import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPSalesReportComponent } from './c-p-sales-report.component';

describe('CPSalesReportComponent', () => {
  let component: CPSalesReportComponent;
  let fixture: ComponentFixture<CPSalesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CPSalesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
