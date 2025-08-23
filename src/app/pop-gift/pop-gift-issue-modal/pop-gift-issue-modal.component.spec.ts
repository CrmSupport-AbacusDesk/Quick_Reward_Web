import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopGiftIssueModalComponent } from './pop-gift-issue-modal.component';

describe('PopGiftIssueModalComponent', () => {
  let component: PopGiftIssueModalComponent;
  let fixture: ComponentFixture<PopGiftIssueModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopGiftIssueModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopGiftIssueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
