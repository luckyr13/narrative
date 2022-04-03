import { TestBed } from '@angular/core/testing';

import { PendingStoriesService } from './pending-stories.service';

describe('PendingStoriesService', () => {
  let service: PendingStoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingStoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
