import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryTargetReportComponent } from './secondary-target-report.component';

describe('SecondaryTargetReportComponent', () => {
  let component: SecondaryTargetReportComponent;
  let fixture: ComponentFixture<SecondaryTargetReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryTargetReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryTargetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
