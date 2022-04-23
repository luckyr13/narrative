import { TestBed } from '@angular/core/testing';

import { SubstoryService } from './substory.service';

describe('SubstoryService', () => {
  let service: SubstoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
