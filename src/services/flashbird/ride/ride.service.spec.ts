import {
  TestBed
} from '@angular/core/testing'
import {
  RideService
} from './ride.service'
import {
  HttpClient,
  provideHttpClient
} from '@angular/common/http'
import {
  provideHttpClientTesting
} from '@angular/common/http/testing'
import {
  ElevationService
} from '../../elevation';
import {
  ElevationServiceFixture,
} from '../../elevation/elevation.fixture';
import {
  firstValueFrom,
  of,
  throwError
} from 'rxjs';
import {
  HTTP_API_RIDE_MOCK,
  SERVICE_ELEVATION_MOCK
} from '../../../testing/mocks'
import {
  flashbirdUrl
} from '../constants';


describe('RideService', () => {
  let service: RideService;
  const mockElevationService = new ElevationServiceFixture();
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ElevationService,
          useValue: mockElevationService
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        }
      ]
    });
    
    service = TestBed.inject(RideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  describe('getRide', () => {
    it('should get ride with elevation', async () => {
      httpClientSpy.post.and.returnValue(of(HTTP_API_RIDE_MOCK))
      mockElevationService.getElevations.and.returnValue(of(SERVICE_ELEVATION_MOCK));
  
      const ride = await firstValueFrom(service.getRide('1234'));

      expect(httpClientSpy.post).toHaveBeenCalledWith(flashbirdUrl, jasmine.stringContaining('"1234"'));
      expect(ride.id).toEqual(HTTP_API_RIDE_MOCK.data.user.ride.id)
      expect(ride.logs!.length).toBe(HTTP_API_RIDE_MOCK.data.user.ride.logs.length);
      expect(ride.logs!.every((l) => !!l.altitude)).toBeTrue();

      ride.logs!.shift();
      expect(ride.logs!.every((l) => !!l.distance)).toBeTrue();
    })


    it('should get ride when if no elevation is available', async () => {
      httpClientSpy.post.and.returnValue(of(HTTP_API_RIDE_MOCK));
      mockElevationService.getElevations.and.returnValue(throwError(() => new Error('elevation failed')));
      const ride = await firstValueFrom(service.getRide('1234'));

      expect(ride.logs?.length).toBe(HTTP_API_RIDE_MOCK.data.user.ride.logs.length);
      expect(ride.logs?.every((l) => !l.altitude)).toBeTrue();
    })
  });
});
