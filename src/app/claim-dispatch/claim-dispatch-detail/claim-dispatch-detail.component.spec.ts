import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDispatchDetailComponent } from './claim-dispatch-detail.component';

describe('ClaimDispatchDetailComponent', () => {
  let component: ClaimDispatchDetailComponent;
  let fixture: ComponentFixture<ClaimDispatchDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDispatchDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDispatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
