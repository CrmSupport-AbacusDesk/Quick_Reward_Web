import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryGiftAddPageComponent } from './secondary-gift-add-page.component';

describe('GiftAddPageComponent', () => {
  let component: SecondaryGiftAddPageComponent;
  let fixture: ComponentFixture<SecondaryGiftAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryGiftAddPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryGiftAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
