import { TestBed } from '@angular/core/testing';

import { AuthGuardLogService } from './auth-guard-log.service';

describe('AuthGuardLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardLogService = TestBed.get(AuthGuardLogService);
    expect(service).toBeTruthy();
  });
});
