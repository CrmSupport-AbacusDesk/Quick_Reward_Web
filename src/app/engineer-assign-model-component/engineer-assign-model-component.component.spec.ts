import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerAssignModelComponentComponent } from './engineer-assign-model-component.component';

describe('EngineerAssignModelComponentComponent', () => {
  let component: EngineerAssignModelComponentComponent;
  let fixture: ComponentFixture<EngineerAssignModelComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerAssignModelComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerAssignModelComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
