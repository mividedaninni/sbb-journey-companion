import { TestBed } from '@angular/core/testing';

import { BackendAuthService } from './backend-auth.service';

describe('BackendAuthService', () => {
  let service: BackendAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
