import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import {
  Ride
} from '../../models'
import {
  BehaviorSubject,
  Subscription,
  distinctUntilChanged,
  filter
} from 'rxjs'
import {
  getSpeedZone,
  getSpeedZoneInfo
} from '../../helpers'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as L from "leaflet/dist/leaflet-src.esm";


@Component({
  selector: 'app-ride-map-osm',
  standalone: false,
  templateUrl: './ride-map-osm.component.html',
  styleUrl: './ride-map-osm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideMapOsmComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() ride?: Ride;
  private rideSubject = new BehaviorSubject<Ride | undefined>(undefined);

  private subscriptions: Subscription[] = [];

  @ViewChild('map')
  private map: ElementRef | undefined;

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
      ).subscribe((ride) => this.renderMap(ride))
    );
  }

  private async renderMap(ride: Ride | undefined) {
    if (ride) {
      const logs = ride!.logs!;

      const map = L.map(this.map!.nativeElement);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: null,
        minZoom: 1,
        maxZoom: 20
      }).addTo(map);

      const states = logs.map((log, index) => {
        const next = logs[index + 1];
        if (next) {
          return {
            type: 'Feature',
            properties: {
              speed: log.speed
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [log.longitude, log.latitude],
                [next.longitude, next.latitude]
              ]]
            }
          }
        }

        return undefined;
      }).filter(e => !!e);

      const path = L.geoJson(states, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style: function (feature: any) {
          const speed = feature.properties.speed;
          const color = getSpeedZoneInfo(getSpeedZone(speed)).color;

          return {
            weight: 5,
            color: color
          }
        }
      });

      path.addTo(map);
      map.fitBounds(path.getBounds());
    }
  }
}
