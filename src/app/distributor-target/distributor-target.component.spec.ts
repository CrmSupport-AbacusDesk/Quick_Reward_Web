import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorTargetComponent } from './distributor-target.component';

describe('DistributorTargetComponent', () => {
  let component: DistributorTargetComponent;
  let fixture: ComponentFixture<DistributorTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
