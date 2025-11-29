import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core'
import {
  CommonModule,
  ViewportScroller
} from '@angular/common'
import {
  Log,
  Ride
} from '../../models'
import {
  toSignal
} from '@angular/core/rxjs-interop'
import {
  getSpeedZone,
  getSpeedZoneInfo
} from '../../helpers'
import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms'
import {
  MatCheckboxModule
} from "@angular/material/checkbox"
import {
  MatIconModule
} from '@angular/material/icon'
import {
  MatButtonModule
} from '@angular/material/button'

@Component({
  selector: 'app-ride-map-google',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './ride-map-google.component.html',
  styleUrl: './ride-map-google.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideMapGoogleComponent implements OnInit, AfterViewInit {
  private renderer = inject(Renderer2);

  private viewportScroller = inject(ViewportScroller);

  public ride = input.required<Ride>();
  public showLabels = input<boolean>();

  @Output() showLabelsUpdated = new EventEmitter<boolean>()

  @ViewChild('map')
  private map: ElementRef | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map3d?: any;


  public showLabelsCheckbox = new FormControl();
  private checkboxValue = toSignal(this.showLabelsCheckbox.valueChanges)
  private mode = computed(() => this.checkboxValue() ? 'HYBRID' : 'SATELLITE');


  public isFullScreen = signal(false);
  public rendered = signal(false);


  constructor() {

    effect(() => {
      const mode = this.mode();
      if (this.map3d) {
        this.renderer.setAttribute(this.map3d, 'mode', mode)
      }
    })

    effect(() => {
      this.showLabelsUpdated.emit(this.checkboxValue());
    })
    
  }

  ngOnInit(): void {
    this.showLabelsCheckbox.setValue(this.showLabels());
  }

  ngAfterViewInit(): void {
    this.renderMap(this.ride());
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
      (this.map3d as any).mode = this.mode();

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
    this.isFullScreen.set(fullScreen);
    this.viewportScroller.scrollToPosition([0, 0]);
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
    }
    else {
      document.body.style.overflow = 'auto';
    }
  }
}
