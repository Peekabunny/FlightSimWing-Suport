import { TestBed } from '@angular/core/testing';

import { Instruction } from './instruction';

describe('Instruction', () => {
  let service: Instruction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Instruction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
