import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProuctWiseSecondaryReportComponent } from './prouct-wise-secondary-report.component';

describe('ProuctWiseSecondaryReportComponent', () => {
  let component: ProuctWiseSecondaryReportComponent;
  let fixture: ComponentFixture<ProuctWiseSecondaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProuctWiseSecondaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProuctWiseSecondaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
