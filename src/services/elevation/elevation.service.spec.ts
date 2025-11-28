import {
  TestBed
} from '@angular/core/testing'
import {
  provideZonelessChangeDetection
} from '@angular/core'
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
        provideZonelessChangeDetection(),
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
