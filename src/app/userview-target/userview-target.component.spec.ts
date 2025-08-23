import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserviewTargetComponent } from './userview-target.component';

describe('UserviewTargetComponent', () => {
  let component: UserviewTargetComponent;
  let fixture: ComponentFixture<UserviewTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserviewTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
