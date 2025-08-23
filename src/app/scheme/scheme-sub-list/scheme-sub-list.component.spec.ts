import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeSubListComponent } from './scheme-sub-list.component';

describe('SchemeSubListComponent', () => {
  let component: SchemeSubListComponent;
  let fixture: ComponentFixture<SchemeSubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeSubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeSubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
