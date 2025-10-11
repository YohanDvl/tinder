import { TestBed } from '@angular/core/testing';

import { NativeToas } from './native-toas';

describe('NativeToas', () => {
  let service: NativeToas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeToas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
