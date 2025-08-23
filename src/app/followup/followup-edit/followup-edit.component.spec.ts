import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupEditComponent } from './followup-edit.component';

describe('FollowupEditComponent', () => {
  let component: FollowupEditComponent;
  let fixture: ComponentFixture<FollowupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
