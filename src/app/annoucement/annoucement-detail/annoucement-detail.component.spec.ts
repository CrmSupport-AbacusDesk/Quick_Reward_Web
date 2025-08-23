import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementDetailComponent } from './annoucement-detail.component';

describe('AnnoucementDetailComponent', () => {
  let component: AnnoucementDetailComponent;
  let fixture: ComponentFixture<AnnoucementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoucementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoucementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
