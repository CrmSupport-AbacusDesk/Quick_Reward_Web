import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryBillUploadAddComponent } from './secondary-bill-upload-add.component';

describe('SecondaryBillUploadAddComponent', () => {
  let component: SecondaryBillUploadAddComponent;
  let fixture: ComponentFixture<SecondaryBillUploadAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryBillUploadAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryBillUploadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
