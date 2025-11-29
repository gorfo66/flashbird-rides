import {
  TestBed
} from '@angular/core/testing'
import {
  RideService
} from './ride.service'
import {
  provideHttpClient
} from '@angular/common/http'
import {
  provideHttpClientTesting
} from '@angular/common/http/testing'


describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(RideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
