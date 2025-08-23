import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDispatchListComponent } from './claim-dispatch-list.component';

describe('ClaimDispatchListComponent', () => {
  let component: ClaimDispatchListComponent;
  let fixture: ComponentFixture<ClaimDispatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDispatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDispatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
