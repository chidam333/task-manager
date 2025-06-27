import { TestBed } from '@angular/core/testing';

import { CustomValidator } from './custom-validator';

describe('CustomValidator', () => {
  let service: CustomValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
