import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinWinAddComponent } from './spin-win-add.component';

describe('SpinWinAddComponent', () => {
  let component: SpinWinAddComponent;
  let fixture: ComponentFixture<SpinWinAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinWinAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinWinAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
