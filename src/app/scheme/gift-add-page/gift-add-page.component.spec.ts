import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftAddPageComponent } from './gift-add-page.component';

describe('GiftAddPageComponent', () => {
  let component: GiftAddPageComponent;
  let fixture: ComponentFixture<GiftAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftAddPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
