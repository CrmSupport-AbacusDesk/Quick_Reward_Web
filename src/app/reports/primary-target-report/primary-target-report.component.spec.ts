import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryTargetReportComponent } from './primary-target-report.component';

describe('PrimaryTargetReportComponent', () => {
  let component: PrimaryTargetReportComponent;
  let fixture: ComponentFixture<PrimaryTargetReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryTargetReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryTargetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
