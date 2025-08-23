import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetVsAchievementReportComponent } from './target-vs-achievement-report.component';

describe('TargetVsAchievementReportComponent', () => {
  let component: TargetVsAchievementReportComponent;
  let fixture: ComponentFixture<TargetVsAchievementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetVsAchievementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetVsAchievementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
