import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryBillUploadDetailComponent } from './secondary-bill-upload-detail.component';

describe('SecondaryBillUploadDetailComponent', () => {
  let component: SecondaryBillUploadDetailComponent;
  let fixture: ComponentFixture<SecondaryBillUploadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryBillUploadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryBillUploadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
