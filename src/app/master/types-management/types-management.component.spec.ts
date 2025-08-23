import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesManagementComponent } from './types-management.component';

describe('TypesManagementComponent', () => {
  let component: TypesManagementComponent;
  let fixture: ComponentFixture<TypesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
