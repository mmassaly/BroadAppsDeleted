import { TestBed } from '@angular/core/testing';

import { ToggleLoginService } from './toggle-login.service';

describe('ToggleLoginService', () => {
  let service: ToggleLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
