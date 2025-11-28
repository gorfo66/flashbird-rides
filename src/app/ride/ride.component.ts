import {
  Component,
  ElementRef,
  Signal,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  ChangeDetectionStrategy
} from '@angular/core'
import {
  CommonModule
} from '@angular/common'
import {
  take,
  distinctUntilChanged,
  map
} from 'rxjs'
import {
  toSignal
} from '@angular/core/rxjs-interop'
import {
  Log,
  Ride,
  SpeedZone
} from '../../models'
import {
  Store
} from '@ngrx/store'
import {
  selectRide,
  selectUiState,
  upsertUiState
} from '../../store'
import {
  average,
  createCharts,
  getSpeedArray,
  getSpeedZone,
  getSpeedZoneInfo,
  getTiltArray,
  max
} from '../../helpers'
import {
  RideService
} from '../../services'
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar'
import {
  Router,
  RouterModule
} from '@angular/router'
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms'
import {
  Chart
} from 'chart.js'
import {
  ViewportScroller
} from '@angular/common'
import {
  MatButtonModule
} from "@angular/material/button"
import {
  MatCheckboxModule
} from '@angular/material/checkbox'
import {
  MatInputModule
} from '@angular/material/input'
import {
  RideMapGoogleComponent,
  StatisticTileComponent
} from "../../components"

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatButtonModule, MatCheckboxModule, MatInputModule, FormsModule, ReactiveFormsModule, RideMapGoogleComponent, StatisticTileComponent],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideComponent {
  private store = inject(Store);
  private rideService = inject(RideService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  public ride = toSignal(
    this.store.select(selectRide).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    { initialValue: undefined }
  ) as Signal<Ride | undefined>;

  public interpolateCheckbox = new FormControl();
  public interpolation = signal<boolean>(false);

  public showMapLabels = toSignal(
    this.store.select(selectUiState).pipe(
      map((state) => state?.showLabels || false),
      distinctUntilChanged()
    ),
    { initialValue: false }
  );

  public averageSpeed = computed(() => {
    const ride = this.ride();
    if (!ride?.logs) return 0;
    return Math.round(average(getSpeedArray(ride)));
  });

  public maxSpeed = computed(() => {
    const ride = this.ride();
    if (!ride?.logs) return 0;
    return Math.round(max(getSpeedArray(ride)));
  });

  public maxTilt = computed(() => {
    const ride = this.ride();
    if (!ride?.logs) return 0;
    return Math.round(max(getTiltArray(ride)));
  });

  public drivingDuration = computed(() => {
    const ride = this.ride();
    if (!ride?.logs) return 0;
    
    let duration = 0;
    ride.logs.forEach((log: Log, index: number) => {
      const next = ride.logs![index + 1];
      if (next) {
        const hasMoved = (next.distance - log.distance) > 2;
        if (hasMoved) {
          duration += (next.gpsTimestamp - log.gpsTimestamp);
        }
      }
    });

    return Math.round(duration);
  });

  public pauseDuration = computed(() => {
    const ride = this.ride();
    if (!ride) return 0;
    const totalDuration = Math.round(ride.endDate.getTime() - ride.startDate.getTime());
    return totalDuration - this.drivingDuration();
  });

  public speedZones = computed(() => {
    const ride = this.ride();
    if (!ride?.logs) return [];

    const output: { zone: SpeedZone; distance: number }[] = [];

    ride.logs.forEach((log: Log, index: number) => {
      const next = ride.logs![index + 1];
      if (next) {
        const distance = next.distance - log.distance;
        const speedZone = getSpeedZone(log.speed);
        const stat = output.find(e => e.zone === speedZone);
        if (stat) {
          stat.distance += distance;
        }
        else {
          output.push({
            zone: speedZone,
            distance: distance
          });
        }
      }
    });

    return output;
  });

  private chartInstances?: {speed?: Chart, tilt?: Chart};

  private speedChart = viewChild<ElementRef>('speedChart');

  private tiltChart = viewChild<ElementRef>('tiltChart');

  constructor() {
    // Subscribe to checkbox value changes and update interpolation signal
    this.interpolateCheckbox.valueChanges.subscribe((change) => {
      this.interpolation.set(change);
    });

    // Effect to handle chart creation when logs or interpolation changes
    // The effect includes a guard to ensure ViewChild elements are available
    effect(() => {
      const logs = this.ride()?.logs;
      const interpolation = this.interpolation();
      const speedChart = this.speedChart();
      const tiltChart = this.tiltChart();
      
      if (logs && speedChart?.nativeElement && tiltChart?.nativeElement) {
        this.createCharts(logs, interpolation, speedChart.nativeElement, tiltChart.nativeElement);
      }
    });
  }

  private createCharts(logs: Log[], interpolation: boolean, speedChart: HTMLCanvasElement, tiltChart: HTMLCanvasElement) {
    
    // Workaround: when chart is re-created, chartjs scroll top.
    // We keep current scroll position and reapply at the bottom
    const currentPageScroll = this.viewportScroller.getScrollPosition()[1];

    // destroy charts if exist
    this.chartInstances?.speed?.destroy();
    this.chartInstances?.tilt?.destroy();

    this.chartInstances = createCharts(logs, interpolation, {
      speed: speedChart,
      tilt: tiltChart
    });

    // Scroll to previous position
    this.viewportScroller.scrollToPosition([0, currentPageScroll]);
  }


  public export(id: string) {
    this.rideService.export(id).pipe(take(1)).subscribe(
      result => {
        if (result) {
          this.snackBar.open('Ride has been sent to your email', undefined, {
            duration: 3000
          });
        }
      }
    )
  }

  public back() {
    this.router.navigate(['rides']);
  }

  public get Math() {
    return Math;
  }


  public getSpeedZoneDisplay(speedZone: SpeedZone): string {
    return getSpeedZoneInfo(speedZone).title
  }

  public getSpeedZoneColor(speedZone: SpeedZone): string {
    return getSpeedZoneInfo(speedZone).color
  }

  public getSpeedZoneDescription(speedZone: SpeedZone): string {
    return getSpeedZoneInfo(speedZone).description
  }

  public showLabelsUpdated(value: boolean) {
    this.store.dispatch(upsertUiState( {uiState: {
      showLabels: value
    }}));
  }
}
