import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSchemeDetailComponent } from './sub-scheme-detail.component';

describe('SubSchemeDetailComponent', () => {
  let component: SubSchemeDetailComponent;
  let fixture: ComponentFixture<SubSchemeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSchemeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSchemeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
