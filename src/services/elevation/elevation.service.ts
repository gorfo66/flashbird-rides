import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, timeout } from 'rxjs';
import { Log } from '../../models';

interface OpenElevationReply {
  results: {
    latitude: number,
    longitude: number,
    elevation: number
  }[]
}


@Injectable({
  providedIn: 'root'
})
export class ElevationService {

  private readonly activated = true;

  constructor(private httpClient: HttpClient) { }


  public getElevations(logs: Log[] | undefined): Observable<Log[]> {
    if (this.activated && !!logs) {
      return this.httpClient.post<OpenElevationReply>(
        'https://api.open-elevation.com/api/v1/lookup',
        JSON.stringify({
          "locations": logs.map((log => ({
            latitude: log.latitude,
            longitude: log.longitude
          })))
        })
      ).pipe(
        timeout(5000),
        map((response) => {
          return response.results
        }),
        map(
          (results) => {
            return logs.map((log, index) => {
              const altitude = results[index].elevation;
              if (altitude) {
                return {
                  ...log,
                  altitude
                }
              }

              return log;
            })
          }
        )
      )
    }

    return of(logs || []);
  }

}
