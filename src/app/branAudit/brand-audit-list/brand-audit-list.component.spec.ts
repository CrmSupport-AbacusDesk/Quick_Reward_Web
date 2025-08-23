import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandAuditListComponent } from './brand-audit-list.component';

describe('BrandAuditListComponent', () => {
  let component: BrandAuditListComponent;
  let fixture: ComponentFixture<BrandAuditListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandAuditListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandAuditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
