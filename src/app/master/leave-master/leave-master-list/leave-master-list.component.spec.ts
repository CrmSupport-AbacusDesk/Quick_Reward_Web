import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMasterListComponent } from './leave-master-list.component';

describe('LeaveMasterListComponent', () => {
  let component: LeaveMasterListComponent;
  let fixture: ComponentFixture<LeaveMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
