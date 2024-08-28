import { TestBed } from '@angular/core/testing';

import { BorderbizService } from './borderbiz.service';

describe('BorderbizService', () => {
  let service: BorderbizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorderbizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
