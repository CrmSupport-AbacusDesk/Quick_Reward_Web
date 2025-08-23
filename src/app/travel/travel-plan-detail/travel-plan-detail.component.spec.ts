import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPlanDetailComponent } from './travel-plan-detail.component';

describe('TravelPlanDetailComponent', () => {
  let component: TravelPlanDetailComponent;
  let fixture: ComponentFixture<TravelPlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
