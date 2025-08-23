import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSchemeSubDetailComponent } from './sub-scheme-sub-detail.component';

describe('SubSchemeSubDetailComponent', () => {
  let component: SubSchemeSubDetailComponent;
  let fixture: ComponentFixture<SubSchemeSubDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSchemeSubDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSchemeSubDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
