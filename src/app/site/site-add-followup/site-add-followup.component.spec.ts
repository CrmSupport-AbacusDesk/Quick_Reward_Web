import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAddFollowupComponent } from './site-add-followup.component';

describe('SiteAddFollowupComponent', () => {
  let component: SiteAddFollowupComponent;
  let fixture: ComponentFixture<SiteAddFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAddFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAddFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
