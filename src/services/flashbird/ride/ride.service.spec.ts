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

  describe('getRideUnion', () => {
    it('should create union of two rides with correct id and name', async () => {
      const ride1Mock = {
        ...HTTP_API_RIDE_MOCK,
        data: {
          user: {
            ride: {
              ...HTTP_API_RIDE_MOCK.data.user.ride,
              id: 'ride-1',
              name: 'Sortie partie 1',
              startTime: 1000000,
              endTime: 2000000
            }
          }
        }
      };

      const ride2Mock = {
        ...HTTP_API_RIDE_MOCK,
        data: {
          user: {
            ride: {
              ...HTTP_API_RIDE_MOCK.data.user.ride,
              id: 'ride-2',
              name: 'Sortie partie 2',
              startTime: 2000000,
              endTime: 3000000
            }
          }
        }
      };

      httpClientSpy.post.and.returnValue(of(ride1Mock));
      mockElevationService.getElevations.and.returnValue(of(SERVICE_ELEVATION_MOCK));

      httpClientSpy.post.and.callFake(() => {
        if (httpClientSpy.post.calls.count() === 1) {
          return of(ride1Mock);
        } else {
          return of(ride2Mock);
        }
      });

      const unionRide = await firstValueFrom(service.getRideUnion(['ride-1', 'ride-2']));

      expect(unionRide.id).toEqual('ride-1+ride-2');
      expect(unionRide.name).toEqual('Sortie');
      expect(unionRide.childRideIds).toEqual(['ride-1', 'ride-2']);
    });

    it('should merge logs from multiple rides', async () => {
      const ride1Mock = {
        ...HTTP_API_RIDE_MOCK,
        data: {
          user: {
            ride: {
              ...HTTP_API_RIDE_MOCK.data.user.ride,
              id: 'ride-1',
              name: 'Ride 1',
              startTime: 1000000,
              endTime: 2000000,
              logs: [
                { latitude: 1, longitude: 1, gpsTimestamp: 1000000, speed: 10, tilt: null },
                { latitude: 2, longitude: 2, gpsTimestamp: 1000100, speed: 10, tilt: null }
              ]
            }
          }
        }
      };

      const ride2Mock = {
        ...HTTP_API_RIDE_MOCK,
        data: {
          user: {
            ride: {
              ...HTTP_API_RIDE_MOCK.data.user.ride,
              id: 'ride-2',
              name: 'Ride 2',
              startTime: 2000000,
              endTime: 3000000,
              logs: [
                { latitude: 3, longitude: 3, gpsTimestamp: 2000000, speed: 10, tilt: null },
                { latitude: 4, longitude: 4, gpsTimestamp: 2000100, speed: 10, tilt: null }
              ]
            }
          }
        }
      };

      let callCount = 0;
      httpClientSpy.post.and.callFake(() => {
        callCount++;
        if (callCount === 1) {
          return of(ride1Mock);
        } else {
          return of(ride2Mock);
        }
      });
      mockElevationService.getElevations.and.returnValue(of(undefined));

      const unionRide = await firstValueFrom(service.getRideUnion(['ride-1', 'ride-2']));

      expect(unionRide.logs!.length).toBe(4);
      expect(unionRide.logs![0].latitude).toEqual(1);
      expect(unionRide.logs![3].latitude).toEqual(4);
    });

    it('should use correct time boundaries', async () => {
      const ride1Mock = {
        ...HTTP_API_RIDE_MOCK,
        data: {
          user: {
            ride: {
              ...HTTP_API_RIDE_MOCK.data.user.ride,
              id: 'ride-1',
              name: 'Ride 1',
              startTime: 1000000,
              endTime: 2000000,
              startLocation: 'Location A',
              endLocation: 'Location B'
            }
          }
        }
      };

      const ride2Mock = {
        ...HTTP_API_RIDE_MOCK,
        data: {
          user: {
            ride: {
              ...HTTP_API_RIDE_MOCK.data.user.ride,
              id: 'ride-2',
              name: 'Ride 2',
              startTime: 2000000,
              endTime: 3000000,
              startLocation: 'Location A',
              endLocation: 'Location C'
            }
          }
        }
      };

      let callCount = 0;
      httpClientSpy.post.and.callFake(() => {
        callCount++;
        return callCount === 1 ? of(ride1Mock) : of(ride2Mock);
      });
      mockElevationService.getElevations.and.returnValue(of(undefined));

      const unionRide = await firstValueFrom(service.getRideUnion(['ride-1', 'ride-2']));

      expect(unionRide.startTime).toBe(1000000);
      expect(unionRide.endTime).toBe(3000000);
      expect(unionRide.startLocation).toBe('Location A');
      expect(unionRide.endLocation).toBe('Location C');
    });

    it('should handle empty id array', async () => {
      const unionRide = await firstValueFrom(service.getRideUnion([]));

      expect(unionRide.id).toBeUndefined();
      expect(unionRide.childRideIds).toBeUndefined();
    });

    it('should handle single ride', async () => {
      httpClientSpy.post.and.returnValue(of(HTTP_API_RIDE_MOCK));
      mockElevationService.getElevations.and.returnValue(of(SERVICE_ELEVATION_MOCK));

      const unionRide = await firstValueFrom(service.getRideUnion(['ride-1']));

      expect(unionRide.id).toEqual('ride-1');
      expect(unionRide.childRideIds).toEqual(['ride-1']);
      expect(unionRide.name).toEqual(HTTP_API_RIDE_MOCK.data.user.ride.name);
    });
  });
});
