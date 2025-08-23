import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppControlListComponent } from './app-control-list.component';

describe('AppControlListComponent', () => {
  let component: AppControlListComponent;
  let fixture: ComponentFixture<AppControlListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppControlListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppControlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
