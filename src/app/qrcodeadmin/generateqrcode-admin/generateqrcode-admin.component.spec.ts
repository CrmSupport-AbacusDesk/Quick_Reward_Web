import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateqrcodeAdminComponent } from './generateqrcode-admin.component';

describe('GenerateqrcodeAdminComponent', () => {
  let component: GenerateqrcodeAdminComponent;
  let fixture: ComponentFixture<GenerateqrcodeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateqrcodeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateqrcodeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
