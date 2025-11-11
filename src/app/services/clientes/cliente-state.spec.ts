import { TestBed } from '@angular/core/testing';

import { ClienteState } from './cliente-state';

describe('ClienteState', () => {
  let service: ClienteState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
