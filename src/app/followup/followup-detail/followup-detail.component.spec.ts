import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupDetailComponent } from './followup-detail.component';

describe('FollowupDetailComponent', () => {
  let component: FollowupDetailComponent;
  let fixture: ComponentFixture<FollowupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
