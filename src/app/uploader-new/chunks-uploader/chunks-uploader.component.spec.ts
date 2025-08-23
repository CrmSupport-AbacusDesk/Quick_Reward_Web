import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunksUploaderComponent } from './chunks-uploader.component';

describe('ChunksUploaderComponent', () => {
  let component: ChunksUploaderComponent;
  let fixture: ComponentFixture<ChunksUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChunksUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChunksUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
