import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { Log, Ride } from '../../models';
import { ElevationService } from '../elevation.service';
import { flashbirdUrl } from './constants';


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


const degreesToRadians = (degrees: number) => {
  return degrees * Math.PI / 180;
}

const distanceInKmBetweenEarthCoordinates = (log1: Log, log2: Log) => {
  let lat1 = log1.latitude;
  let lon1 = log1.longitude;
  let lat2 = log2.latitude;
  let lon2 = log2.longitude;
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
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
