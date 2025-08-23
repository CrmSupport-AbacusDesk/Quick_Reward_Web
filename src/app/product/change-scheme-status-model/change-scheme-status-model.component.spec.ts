import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSchemeStatusModelComponent } from './change-scheme-status-model.component';

describe('ChangeSchemeStatusModelComponent', () => {
  let component: ChangeSchemeStatusModelComponent;
  let fixture: ComponentFixture<ChangeSchemeStatusModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSchemeStatusModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSchemeStatusModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
