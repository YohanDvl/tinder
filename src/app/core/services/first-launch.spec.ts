import { TestBed } from '@angular/core/testing';

import { FirstLaunch } from './first-launch';

describe('FirstLaunch', () => {
  let service: FirstLaunch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstLaunch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
