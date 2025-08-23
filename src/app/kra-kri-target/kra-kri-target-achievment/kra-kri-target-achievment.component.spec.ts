import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KraKriTargetAchievmentComponent } from './kra-kri-target-achievment.component';

describe('KraKriTargetAchievmentComponent', () => {
  let component: KraKriTargetAchievmentComponent;
  let fixture: ComponentFixture<KraKriTargetAchievmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KraKriTargetAchievmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KraKriTargetAchievmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
