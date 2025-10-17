import {
  TestBed
} from '@angular/core/testing'
import {
  provideHttpClient
} from '@angular/common/http'
import {
  provideHttpClientTesting
} from '@angular/common/http/testing'


import {
  ElevationService
} from './elevation.service'

describe('ElevationService', () => {
  let service: ElevationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ElevationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
