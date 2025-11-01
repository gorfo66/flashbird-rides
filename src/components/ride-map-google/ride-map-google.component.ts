import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  inject,
  signal
} from '@angular/core'
import {
  Log,
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
import {
  FormControl
} from '@angular/forms'
import {
  ViewportScroller
} from '@angular/common';

@Component({
  selector: 'app-ride-map-google',
  standalone: false,
  templateUrl: './ride-map-google.component.html',
  styleUrl: './ride-map-google.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideMapGoogleComponent implements OnChanges, OnDestroy, AfterViewInit {
  private renderer = inject(Renderer2);

  private viewportScroller = inject(ViewportScroller);

  @Input() ride?: Ride;
  private rideSubject = new BehaviorSubject<Ride | undefined>(undefined);

  @Input() showLabels = false;

  @Output() showLabelsUpdated = new EventEmitter<boolean>()

  private subscriptions: Subscription[] = [];

  @ViewChild('map')
  private map: ElementRef | undefined;


  public showLabelsCheckbox = new FormControl();
  private mode = 'SATELLITE';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map3d?: any;


  public isFullScreen = false;
  public rendered = signal(false);


  constructor() {
    this.subscriptions.push(
      this.showLabelsCheckbox.valueChanges.subscribe((change) => {
        this.showLabelsUpdated.emit(change);
        this.mode = change ? 'HYBRID' : 'SATELLITE';
        this.updateModeValue();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['ride']) {
      this.rideSubject.next(this.ride);
    }

    if (changes['showLabels']) {
      this.showLabelsCheckbox.setValue(this.showLabels);
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

  private updateModeValue() {
    if (this.map3d) {
      this.renderer.setAttribute(this.map3d, 'mode', this.mode)
    }
  }


  private async loadLibraries(): Promise<google.maps.Maps3DLibrary> {
    return await google.maps.importLibrary("maps3d") as google.maps.Maps3DLibrary;
  }

  private async renderMap(ride: Ride | undefined) {
    if (ride) {
      const logs = ride!.logs!;

      const { AltitudeMode, Map3DElement, Polyline3DElement } = await this.loadLibraries();

      this.map3d = new Map3DElement()
      this.map3d.center = this.getCenter(logs);
      this.map3d.range = ride!.distance > 100000 ? 50000 : 10000;
      this.map3d.tilt = 60;
      this.map3d.heading = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.map3d as any).mode = this.mode;

      logs.forEach((log, index) => {
        const next = logs[index + 1];
        if (next) {
          const line = new Polyline3DElement();
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
          this.map3d.append(line);
        }
      });

      this.map3d.addEventListener('gmp-tiltchange', () => {
        this.map3d.removeEventListener('gmp-tiltchange');
        setTimeout(() => {
          this.rendered.set(true);
        }, 1000)
      });
      
      this.renderer.appendChild(this.map?.nativeElement, this.map3d);
    }
  }

  public toggleFullScreen(fullScreen: boolean) {
    this.isFullScreen = fullScreen;
    this.viewportScroller.scrollToPosition([0, 0]);
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'auto';
    }
  }
}
