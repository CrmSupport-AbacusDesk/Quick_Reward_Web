import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpesneEditComponent } from './expesne-edit.component';

describe('ExpesneEditComponent', () => {
  let component: ExpesneEditComponent;
  let fixture: ComponentFixture<ExpesneEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpesneEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpesneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
