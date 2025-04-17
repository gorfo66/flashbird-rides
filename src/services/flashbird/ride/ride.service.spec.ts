import { TestBed } from '@angular/core/testing';

import { RideService } from './ride.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, of } from 'rxjs';
import { flashbirdUrl } from '../constants';
import { Ride } from '../../../models';
import { ElevationService } from '../../elevation';
import { ElevationServiceFixture } from '../../elevation/elevation.fixture';
import { GetRidesReply, GetRideReply, ExportReply } from '../flashbird-api-reply.model';


describe('RideService', () => {
  let service: RideService;
  let httpTesting: HttpTestingController;
  const mockElevationService = new ElevationServiceFixture();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ElevationService, useValue: mockElevationService
        }
      ]
    });

    service = TestBed.inject(RideService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRides should return fully qualified rides from fake API response', async () => {
    const responseContent: GetRidesReply = {
      data: {
        user: {
          devices: [
            {
              rides: [
                {
                  id: '1',
                  name: 'ride 1',
                  distance: 1000,
                  startLocation: 'start',
                  endLocation: 'end',
                  startTime: new Date('2024-12-01 14:00').getTime(),
                  endTime: new Date('2024-12-01 15:00').getTime()
                } as Ride,
                {
                  id: '2',
                  name: 'ride 2',
                  distance: 1000,
                  startLocation: 'start',
                  endLocation: 'end',
                  startTime: new Date('2025-01-01 14:00').getTime(),
                  endTime: new Date('2025-01-01 15:00').getTime()
                } as Ride,
                {
                  id: '2',
                  name: 'ride 2',
                  distance: 0,
                  startLocation: 'start',
                  endLocation: 'end',
                  startTime: new Date('2025-01-01 14:00').getTime(),
                  endTime: new Date('2025-01-01 15:00').getTime()
                } as Ride
              ]
            }
          ]
        }
      }
    }

    const rides$ = firstValueFrom(service.getRides());
    const req = httpTesting.expectOne(flashbirdUrl, 'Request');
    const body = JSON.parse(req.request.body);
    expect(req.request.method).toBe('POST');
    expect(body.operationName).toEqual('Rides');
    req.flush(responseContent);

    const rides = await rides$;
    expect(rides.length).toEqual(2); // Filter out rides without distance
    expect(rides[0].id).toEqual('2'); // Sort by date desc
    expect(rides[1].id).toEqual('1');
    expect(rides[0].startDate).toBeDefined();
    expect(rides[0].endDate).toBeDefined();

  });

  it('getRide should return fully qualified ride from fake API response', async () => {
    mockElevationService.getElevations.and.returnValue(of([]));
    
    const responseContent: GetRideReply = {
      data: {
        user: {
          ride: {
            id: '1',
            name: 'ride 1',
            distance: 1000,
            startLocation: 'start',
            endLocation: 'end',
            startTime: new Date('2024-12-01 14:00').getTime(),
            endTime: new Date('2024-12-01 15:00').getTime(),
            logs: [
              {
                latitude: 43.520199,
                longitude: 6.861882,
                gpsTimestamp: 1744441575400,
                speed: 48.511288,
                tilt: 9.34
              },
              {
                latitude: 43.520035,
                longitude: 6.861708,
                gpsTimestamp: 1744441577100,
                speed: 43.683125,
                tilt: 7.52
              },
              {
                latitude: 43.519848,
                longitude: 6.861314,
                gpsTimestamp: 1744441580200,
                speed: 46.772263,
                tilt: 4.29
              }
            ]
          } as Ride
        }
      }
    }

    const ride$ = firstValueFrom(service.getRide('1'));
    const req = httpTesting.expectOne(flashbirdUrl, 'Request');
    const body = JSON.parse(req.request.body);
    expect(req.request.method).toBe('POST');
    expect(body.operationName).toEqual('Logs');
    expect(body.variables.rideId).toEqual('1');
    req.flush(responseContent);

    const ride = await ride$;
    expect(ride).toBeDefined();
  });

  it('export should return true', async () => {
    const responseContent: ExportReply = {
      data: {
        exportToGPX: true
      }
    }

    const response$ = firstValueFrom(service.export('1'));
    const req = httpTesting.expectOne(flashbirdUrl, 'Request');
    const body = JSON.parse(req.request.body);
    expect(req.request.method).toBe('POST');
    expect(body.operationName).toEqual('ExportToGPX');
    expect(body.variables.exportToGpxId).toEqual('1');
    req.flush(responseContent);

    expect(await response$).toBeTrue();
  });
});
