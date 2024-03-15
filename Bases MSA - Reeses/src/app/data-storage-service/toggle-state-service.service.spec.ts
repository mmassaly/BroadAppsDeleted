import { TestBed } from '@angular/core/testing';

import { ToggleStateServiceService } from './toggle-state-service.service';

describe('ToggleStateServiceService', () => {
  let service: ToggleStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
