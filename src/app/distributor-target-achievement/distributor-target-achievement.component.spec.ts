import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorTargetAchievementComponent } from './distributor-target-achievement.component';

describe('DistributorTargetAchievementComponent', () => {
  let component: DistributorTargetAchievementComponent;
  let fixture: ComponentFixture<DistributorTargetAchievementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorTargetAchievementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorTargetAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
