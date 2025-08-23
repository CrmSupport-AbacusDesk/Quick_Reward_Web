import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppControlModalComponent } from './app-control-modal.component';

describe('AppControlModalComponent', () => {
  let component: AppControlModalComponent;
  let fixture: ComponentFixture<AppControlModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppControlModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
