import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrandMasterBoxComponent } from './add-grand-master-box.component';

describe('AddGrandMasterBoxComponent', () => {
  let component: AddGrandMasterBoxComponent;
  let fixture: ComponentFixture<AddGrandMasterBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrandMasterBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrandMasterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
