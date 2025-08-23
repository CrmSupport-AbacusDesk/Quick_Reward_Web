import { TestBed, async, inject } from '@angular/core/testing';

import { AuthComponentGuard } from './auth-component.guard';

describe('AuthComponentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthComponentGuard]
    });
  });

  it('should ...', inject([AuthComponentGuard], (guard: AuthComponentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
