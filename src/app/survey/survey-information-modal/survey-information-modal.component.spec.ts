import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyInformationModalComponent } from './survey-information-modal.component';

describe('SurveyInformationModalComponent', () => {
  let component: SurveyInformationModalComponent;
  let fixture: ComponentFixture<SurveyInformationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyInformationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyInformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
