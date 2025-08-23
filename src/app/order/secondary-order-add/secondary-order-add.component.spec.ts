import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryOrderAddComponent } from './secondary-order-add.component';

describe('SecondaryOrderAddComponent', () => {
  let component: SecondaryOrderAddComponent;
  let fixture: ComponentFixture<SecondaryOrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryOrderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
