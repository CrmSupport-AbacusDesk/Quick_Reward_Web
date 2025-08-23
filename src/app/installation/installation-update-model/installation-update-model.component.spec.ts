import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationUpdateModelComponent } from './installation-update-model.component';

describe('InstallationUpdateModelComponent', () => {
  let component: InstallationUpdateModelComponent;
  let fixture: ComponentFixture<InstallationUpdateModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationUpdateModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
