import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintUpdateModelComponent } from './complaint-update-model.component';

describe('ComplaintUpdateModelComponent', () => {
  let component: ComplaintUpdateModelComponent;
  let fixture: ComponentFixture<ComplaintUpdateModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintUpdateModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
