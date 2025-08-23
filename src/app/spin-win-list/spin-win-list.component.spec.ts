import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinWinListComponent } from './spin-win-list.component';

describe('SpinWinListComponent', () => {
  let component: SpinWinListComponent;
  let fixture: ComponentFixture<SpinWinListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinWinListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinWinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
