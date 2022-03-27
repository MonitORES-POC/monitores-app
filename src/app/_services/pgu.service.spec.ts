import { TestBed } from '@angular/core/testing';

import { PguService } from './pgu.service';

describe('PguService', () => {
  let service: PguService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PguService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
