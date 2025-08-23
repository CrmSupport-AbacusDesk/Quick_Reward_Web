import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassScanningComponent } from './gatepass-scanning.component';

describe('GatepassScanningComponent', () => {
  let component: GatepassScanningComponent;
  let fixture: ComponentFixture<GatepassScanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatepassScanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassScanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
