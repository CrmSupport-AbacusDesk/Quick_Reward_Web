import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryBillUploadListComponent } from './secondary-bill-upload-list.component';

describe('SecondaryBillUploadListComponent', () => {
  let component: SecondaryBillUploadListComponent;
  let fixture: ComponentFixture<SecondaryBillUploadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryBillUploadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryBillUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
