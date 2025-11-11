import { TestBed } from '@angular/core/testing';

import { MedidorState } from './medidor-state';

describe('MedidorState', () => {
  let service: MedidorState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedidorState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
