import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopGiftReportComponent } from './pop-gift-report.component';

describe('PopGiftReportComponent', () => {
  let component: PopGiftReportComponent;
  let fixture: ComponentFixture<PopGiftReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopGiftReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopGiftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
