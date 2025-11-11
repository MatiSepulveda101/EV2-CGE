import { TestBed } from '@angular/core/testing';

import { Lectura } from './lectura';

describe('Lectura', () => {
  let service: Lectura;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lectura);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
