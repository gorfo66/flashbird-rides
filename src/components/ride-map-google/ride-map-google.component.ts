import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Log, Ride } from '../../models';
import { BehaviorSubject, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { getSpeedZone, getSpeedZoneInfo } from '../../helpers';

@Component({
  selector: 'app-ride-map-google',
  standalone: false,
  templateUrl: './ride-map-google.component.html',
  styleUrl: './ride-map-google.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideMapGoogleComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() ride?: Ride;
  private rideSubject = new BehaviorSubject<Ride | undefined>(undefined);

  private subscriptions: Subscription[] = [];

  @ViewChild('map')
  private map: ElementRef | undefined;


  constructor(private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ride']) {
      this.rideSubject.next(this.ride);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.rideSubject.pipe(
        filter(ride => !!ride && !!ride.logs),
        distinctUntilChanged()
      ).subscribe(async (ride) => {
        const logs = ride!.logs!;

        const {AltitudeMode } = await google.maps.importLibrary("maps3d") as google.maps.Maps3DLibrary;

        const map3d = this.renderer.createElement('gmp-map-3d') as google.maps.maps3d.Map3DElement;
        map3d.center = this.getCenter(logs);
        map3d.range = ride!.distance > 100000 ? 50000 : 10000;
        map3d.tilt = 0;
        map3d.heading = 0;
        map3d.defaultLabelsDisabled = false;
        

        logs.forEach((log, index) => {
          const next = logs[index + 1];
          if (next) {
            const line = this.renderer.createElement('gmp-polyline-3d') as google.maps.maps3d.Polyline3DElement;
            line.coordinates = [
              {
                lat: log.latitude,
                lng: log.longitude
              },
              {
                lat: next.latitude,
                lng: next.longitude
              }
            ];
            line.altitudeMode = AltitudeMode.CLAMP_TO_GROUND;
            line.strokeColor = getSpeedZoneInfo(getSpeedZone(log.speed)).color;
            line.strokeWidth = 5;
            line.strokeOpacity = 0.3;
            this.renderer.appendChild(map3d, line);
          }
        });
        
        this.renderer.appendChild(this.map?.nativeElement, map3d);
        
      })
    );
  }

  private getCenter(logs: Log[]): google.maps.LatLngAltitudeLiteral {
    const longitudes = logs.map((log) => log.longitude);
    const latitudes = logs.map((log) => log.latitude);
    const minLongitude = Math.min(...longitudes);
    const minLatitude = Math.min(...latitudes);
    const centerLongitude = (Math.max(...longitudes) - minLongitude) / 2 + minLongitude;
    const centerLatitude = (Math.max(...latitudes) - minLatitude) / 2 + minLatitude;
    
    return {
      lat: centerLatitude, 
      lng: centerLongitude,
      altitude: 0
    };
  }
}
