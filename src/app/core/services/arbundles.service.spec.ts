import { TestBed } from '@angular/core/testing';

import { ArbundlesService } from './arbundles.service';

describe('ArbundlesService', () => {
  let service: ArbundlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArbundlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
