import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageModuleComponent } from './image-module.component';

describe('ImageModuleComponent', () => {
  let component: ImageModuleComponent;
  let fixture: ComponentFixture<ImageModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
