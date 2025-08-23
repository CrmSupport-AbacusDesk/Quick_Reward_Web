import { TestBed } from '@angular/core/testing';

import { ExportexcelService } from './exportexcel.service';

describe('ExportexcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportexcelService = TestBed.get(ExportexcelService);
    expect(service).toBeTruthy();
  });
});
