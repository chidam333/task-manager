import { TestBed } from '@angular/core/testing';

import { AuthFetch } from './auth-fetch';

describe('AuthFetch', () => {
  let service: AuthFetch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthFetch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
