import { TestBed } from '@angular/core/testing';

import { SupportIssue } from './support-issue';

describe('SupportIssue', () => {
  let service: SupportIssue;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportIssue);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
