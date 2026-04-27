import {
  HttpClient
} from '@angular/common/http'
import {
  Injectable,
  inject
} from '@angular/core'
import {
  Observable,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of
} from 'rxjs'
import {
  ExportReply,
  GetRideReply,
  GetRidesReply,
  Log,
  Ride
} from '../../../models'
import {
  ElevationService
} from '../../elevation/elevation.service'
import {
  flashbirdUrl
} from '../constants'
import {
  distanceInKmBetweenEarthCoordinates
} from '../../../helpers'


const postProcessRide = (ride: Ride): Ride => {
  return {
    ...ride,
    ...ride.logs ? { logs: postProcessLog(ride.logs) } : {},
    startDate: new Date(ride.startTime),
    endDate: new Date(ride.endTime)
  }
}

const postProcessLog = (logs: Log[]) => {
  let distance = 0;
  return logs.map((log, index) => {
    if (index > 0) {
      const previousLog = logs[index - 1];
      const segmentDistance = distanceInKmBetweenEarthCoordinates(previousLog, log);
      distance += segmentDistance;

    }

    return {
      ...log,
      distance: Math.round(distance * 1000)
    }
  });
}

const extractRideName = (name: string): string => {
  return name.replace(/\s*partie\s+.*/i, '').trim();
}

const getDateKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

const hasPartieInName = (name: string): boolean => {
  return /\s*partie\s+/i.test(name);
}



@Injectable({
  providedIn: 'root'
})
export class RideService {
  private httpClient = inject(HttpClient);
  private elevationService = inject(ElevationService);

  public getRides(): Observable<Ride[]> {
    return this.httpClient.post<GetRidesReply>(
      flashbirdUrl,
      JSON.stringify({
        "query": "query Rides{user{devices{rides{id name startTime endTime startLocation endLocation distance}}}}",
        "variables": {},
        "operationName": "Rides"
      })
    ).pipe(
      map((response) => {
        return response.data.user.devices.map((device) => device.rides).reduce((previous, current) => ([...previous, ...current]), []);
      }),
      map((rides) => rides.filter(ride => !!ride.distance).map(postProcessRide).sort((a, b) => (b.startTime - a.startTime))),
      mergeMap((rides) => this.mergePartialRides(rides))
    )
  }

  private mergePartialRides(rides: Ride[]): Observable<Ride[]> {
    // Group rides by day and base name
    const groupsByDayAndName = new Map<string, Ride[]>();

    rides.forEach(ride => {
      if (hasPartieInName(ride.name)) {
        const key = `${getDateKey(ride.startTime)}-${extractRideName(ride.name)}`;
        if (!groupsByDayAndName.has(key)) {
          groupsByDayAndName.set(key, []);
        }
        groupsByDayAndName.get(key)!.push(ride);
      }
    });

    // Find groups that need merging (multiple rides with same day and base name)
    const mergedRides: Ride[] = [];
    const mergedIds = new Set<string>();

    groupsByDayAndName.forEach((group) => {
      if (group.length > 1) {
        // Merge multiple rides into one
        const sortedGroup = group.sort((a, b) => a.startTime - b.startTime);
        const ids = sortedGroup.map(r => r.id);
        const mergedId = ids.join('+');
        const mergedName = extractRideName(sortedGroup[0].name);
        const startTime = Math.min(...sortedGroup.map(r => r.startTime));
        const endTime = Math.max(...sortedGroup.map(r => r.endTime));
        
        const merged: Ride = {
          id: mergedId,
          name: mergedName,
          startTime: startTime,
          endTime: endTime,
          startDate: new Date(startTime),
          endDate: new Date(endTime),
          startLocation: group[0]!.startLocation,
          endLocation: group.at(-1)!.endLocation,
          distance: group.reduce((sum, r) => sum + r.distance, 0),
          childRideIds: ids
        };

        mergedRides.push(merged);
        ids.forEach(id => mergedIds.add(id));
      }
    });

    // Combine non-merged rides with merged rides and sort
    const result = rides.filter(ride => !mergedIds.has(ride.id))
      .concat(mergedRides)
      .sort((a, b) => (b.startTime - a.startTime));

    return of(result);
  }


  public getRideUnion(ids: string[]): Observable<Ride> {
    if (ids.length === 0) {
      return of({} as Ride);
    }

    const rideObservables = ids.map(id => this.getRide(id));

    return forkJoin(rideObservables).pipe(
      map((rides) => rides.sort((a, b) => a.startTime - b.startTime)),
      map((rides) => {
        const unionId = ids.join('+');
        const commonName = extractRideName(rides[0].name);
        const allLogs = rides.flatMap(r => r.logs || []);
        const processedLogs = postProcessLog(allLogs);

        return {
          id: unionId,
          name: commonName,
          startTime: Math.min(...rides.map(r => r.startTime)),
          endTime: Math.max(...rides.map(r => r.endTime)),
          startDate: new Date(Math.min(...rides.map(r => r.startTime))),
          endDate: new Date(Math.max(...rides.map(r => r.endTime))),
          startLocation: rides[0].startLocation,
          endLocation: rides.at(-1)!.endLocation,
          distance: rides.reduce((sum, r) => sum + r.distance, 0),
          logs: processedLogs,
          childRideIds: ids
        };
      })
    );
  }

  public getRide(id: string): Observable<Ride> {
    return this.httpClient.post<GetRideReply>(
      flashbirdUrl,
      JSON.stringify({
        "query": "query Logs($rideId: ID!) { user { ride(id: $rideId) { logs { latitude longitude gpsTimestamp speed tilt } id name startTime endTime startLocation endLocation distance}}}",
        "variables": { "rideId": id },
        "operationName": "Logs"
      })
    ).pipe(
      map((response) => {
        return response.data.user.ride
      }),
      map(postProcessRide),
      mergeMap(
        (ride) => {
          return this.elevationService.getElevations(ride.logs).pipe(
            map((logs) => {
              if (logs) {
                return {
                  ...ride,
                  logs
                }
              }

              return ride;

            }),
            catchError(() => of(ride)),
          )
        }
      )
    )
  }


  public export(id: string): Observable<boolean> {
    return this.httpClient.post<ExportReply>(
      flashbirdUrl,
      JSON.stringify({
        "query": "mutation ExportToGPX($exportToGpxId: ID!) { exportToGPX(id: $exportToGpxId) }",
        "variables": { "exportToGpxId": id },
        "operationName": "ExportToGPX"
      })
    ).pipe(
      map((response) => {
        return response.data?.exportToGPX
      })
    )
  }
}
