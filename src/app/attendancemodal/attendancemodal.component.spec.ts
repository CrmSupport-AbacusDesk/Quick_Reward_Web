import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancemodalComponent } from './attendancemodal.component';

describe('AttendancemodalComponent', () => {
  let component: AttendancemodalComponent;
  let fixture: ComponentFixture<AttendancemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendancemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
