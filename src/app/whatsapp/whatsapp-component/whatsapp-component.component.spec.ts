import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappComponentComponent } from './whatsapp-component.component';

describe('WhatsappComponentComponent', () => {
  let component: WhatsappComponentComponent;
  let fixture: ComponentFixture<WhatsappComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
