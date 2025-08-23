import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareListComponent } from './spare-list.component';

describe('SpareListComponent', () => {
  let component: SpareListComponent;
  let fixture: ComponentFixture<SpareListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
