import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable } from 'rxjs';
import { Log, Ride } from '../../models';
import { ElevationService } from '../elevation.service';
import { flashbirdUrl } from './constants';
import { distanceInKmBetweenEarthCoordinates } from '../../helpers';


const postProcessRide = (ride: Ride): Ride => {
  return {
    ...ride,
    ... !!ride.logs ? {logs: postProcessLog(ride.logs)} : {},
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
    return this.httpClient.post(
      flashbirdUrl, 
      JSON.stringify({"query":"query Rides{user{devices{rides{id name startTime endTime startLocation endLocation distance}}}}","variables":{},"operationName":"Rides"})
    ).pipe(
      map((response:any) => {
        return response.data?.user?.devices[0]?.rides as Ride[]
      }),
      map((rides) => rides.filter(ride => !!ride.distance).map(postProcessRide))
    )
  }


  public getRide(id: string): Observable<Ride> {
    return this.httpClient.post(
      flashbirdUrl, 
      JSON.stringify({"query":"query Logs($rideId: ID!) { user { ride(id: $rideId) { logs { latitude longitude gpsTimestamp speed tilt } id name startTime endTime startLocation endLocation distance}}}","variables":{"rideId":id},"operationName":"Logs"})
    ).pipe(
      map((response:any) => {
        return response.data?.user?.ride as Ride
      }),
      map(postProcessRide),
      mergeMap(
        (ride) => {
          return this.elevationService.getElevations(ride.logs).pipe(map((logs) => {
            return {
              ...ride,
              logs
            }
          }))
        }
      )
    )
  }
}
