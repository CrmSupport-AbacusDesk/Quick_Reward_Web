import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaverejectstatusComponent } from './leaverejectstatus.component';

describe('LeaverejectstatusComponent', () => {
  let component: LeaverejectstatusComponent;
  let fixture: ComponentFixture<LeaverejectstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaverejectstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaverejectstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
