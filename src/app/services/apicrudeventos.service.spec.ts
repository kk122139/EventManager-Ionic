import { TestBed } from '@angular/core/testing';

import { ApicrudeventosService } from './apicrudeventos.service';

describe('ApicrudeventosService', () => {
  let service: ApicrudeventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApicrudeventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
