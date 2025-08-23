import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeSubAddComponent } from './scheme-sub-add.component';

describe('SchemeSubAddComponent', () => {
  let component: SchemeSubAddComponent;
  let fixture: ComponentFixture<SchemeSubAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeSubAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeSubAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
