import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMasterAddComponent } from './leave-master-add.component';

describe('LeaveMasterAddComponent', () => {
  let component: LeaveMasterAddComponent;
  let fixture: ComponentFixture<LeaveMasterAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveMasterAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMasterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
