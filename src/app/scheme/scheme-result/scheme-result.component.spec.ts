import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeResultComponent } from './scheme-result.component';

describe('SchemeResultComponent', () => {
  let component: SchemeResultComponent;
  let fixture: ComponentFixture<SchemeResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
