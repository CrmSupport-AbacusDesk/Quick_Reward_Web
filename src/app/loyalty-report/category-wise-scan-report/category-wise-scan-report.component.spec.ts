import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryWiseScanReportComponent } from './category-wise-scan-report.component';

describe('CategoryWiseScanReportComponent', () => {
  let component: CategoryWiseScanReportComponent;
  let fixture: ComponentFixture<CategoryWiseScanReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryWiseScanReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseScanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
