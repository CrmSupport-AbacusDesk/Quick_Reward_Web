import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialVideoListComponent } from './tutorial-video-list.component';

describe('TutorialVideoListComponent', () => {
  let component: TutorialVideoListComponent;
  let fixture: ComponentFixture<TutorialVideoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialVideoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialVideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
