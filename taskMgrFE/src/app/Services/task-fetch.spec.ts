import { TestBed } from '@angular/core/testing';

import { TaskFetch } from './task-fetch';

describe('TaskFetch', () => {
  let service: TaskFetch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskFetch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
