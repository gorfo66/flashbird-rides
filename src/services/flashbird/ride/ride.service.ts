import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { Log, Ride, GetRideReply, GetRidesReply, ExportReply } from '../../../models';
import { ElevationService } from '../../elevation/elevation.service';
import { flashbirdUrl } from '../constants';
import { distanceInKmBetweenEarthCoordinates } from '../../../helpers';


const postProcessRide = (ride: Ride): Ride => {
  return {
    ...ride,
    ... ride.logs ? {logs: postProcessLog(ride.logs)} : {},
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



@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor( private httpClient: HttpClient, private elevationService: ElevationService) { }


  public getRides(): Observable<Ride[]> {
    return this.httpClient.post<GetRidesReply>(
      flashbirdUrl, 
      JSON.stringify({"query":"query Rides{user{devices{rides{id name startTime endTime startLocation endLocation distance}}}}","variables":{},"operationName":"Rides"})
    ).pipe(
      map((response) => {
        return response.data.user.devices.map((device) => device.rides).reduce((previous, current) => ([...previous, ... current]), []);
      }),
      map((rides) => rides.filter(ride => !!ride.distance).map(postProcessRide).sort((a, b) => (b.startTime - a.startTime)))
    )
  }


  public getRide(id: string): Observable<Ride> {
    return this.httpClient.post<GetRideReply>(
      flashbirdUrl, 
      JSON.stringify({"query":"query Logs($rideId: ID!) { user { ride(id: $rideId) { logs { latitude longitude gpsTimestamp speed tilt } id name startTime endTime startLocation endLocation distance}}}","variables":{"rideId":id},"operationName":"Logs"})
    ).pipe(
      map((response) => {
        return response.data.user.ride
      }),
      map(postProcessRide),
      mergeMap(
        (ride) => {
          return this.elevationService.getElevations(ride.logs).pipe(
            map((logs) => {
              return {
                ...ride,
                logs
              }
            }),
            catchError( () => of(ride)),
          )
        }
      )
    )
  }


  public export(id: string): Observable<boolean> {
    return this.httpClient.post<ExportReply>(
      flashbirdUrl, 
      JSON.stringify({"query":"mutation ExportToGPX($exportToGpxId: ID!) { exportToGPX(id: $exportToGpxId) }","variables":{"exportToGpxId": id},"operationName":"ExportToGPX"})
    ).pipe(
      map((response) => {
        return response.data?.exportToGPX
      })
    )
  }
}
