import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertToDistributorComponent } from './convert-to-distributor.component';

describe('ConvertToDistributorComponent', () => {
  let component: ConvertToDistributorComponent;
  let fixture: ComponentFixture<ConvertToDistributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertToDistributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertToDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
