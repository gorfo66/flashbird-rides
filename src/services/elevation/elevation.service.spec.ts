import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


import { ElevationService } from './elevation.service';
import { OpenElevationReply } from './open-elevation-reply.model';
import { firstValueFrom } from 'rxjs';
import { Log } from '../../models';

describe('ElevationService', () => {
  let service: ElevationService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ElevationService);
    httpTesting = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('getElevations should return result if logs are provided', async () => {
    const responseContent: OpenElevationReply = {
      results: [
        {
          elevation: 10,
          latitude: 43.520199,
          longitude: 6.861882
        },
        {
          elevation: 20,
          latitude: 43.520035,
          longitude: 6.861708

        },
        {
          elevation: 0,
          latitude: 43.519848,
          longitude: 6.861314
        }
      ]
    }

    const logs: Log[] = [
      {
        latitude: 43.520199,
        longitude: 6.861882,
        gpsTimestamp: 1744441575400,
        speed: 48.511288,
        tilt: 9.34,
        distance: 0
      },
      {
        latitude: 43.520035,
        longitude: 6.861708,
        gpsTimestamp: 1744441577100,
        speed: 43.683125,
        tilt: 7.52,
        distance: 10
      },
      {
        latitude: 43.519848,
        longitude: 6.861314,
        gpsTimestamp: 1744441580200,
        speed: 46.772263,
        tilt: 4.29,
        distance: 20
      }
    ]

    const elevations$ = firstValueFrom(service.getElevations(logs));
    const req = httpTesting.expectOne('https://api.open-elevation.com/api/v1/lookup', 'Request');
    const body = JSON.parse(req.request.body);
    expect(req.request.method).toBe('POST');
    expect(body.locations.length).toEqual(3);
    req.flush(responseContent);

    const elevations = await elevations$;
    expect(elevations).toEqual([
      {
        ...logs[0],
        altitude: 10
      }, {
        ...logs[1],
        altitude: 20
      }, {
        ...logs[2]
      }
    ]);
  });

  it('getElevations should return empty array if logs are not provided', async () => {
    const elevations = await firstValueFrom(service.getElevations(undefined));
    expect(elevations).toEqual([]);
  });
});
