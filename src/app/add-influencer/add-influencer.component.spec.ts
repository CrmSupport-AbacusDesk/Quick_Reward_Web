import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfluencerComponent } from './add-influencer.component';

describe('AddInfluencerComponent', () => {
  let component: AddInfluencerComponent;
  let fixture: ComponentFixture<AddInfluencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInfluencerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
