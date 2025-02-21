import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, Subscription, take } from 'rxjs';
import { Log, Ride, SpeedZone } from '../../models';
import { Store } from '@ngrx/store';
import { selectRide, selectUiState, upsertUiState } from '../../store';
import { average, createCharts, getSpeedArray, getSpeedZone, getSpeedZoneInfo, getTiltArray, max } from '../../helpers';
import { RideService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-ride',
  standalone: false,

  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss'
})
export class RideComponent implements AfterViewInit, OnDestroy, OnInit {

  public ride$: Observable<Ride>;
  public averageSpeed$: Observable<number>;
  public maxSpeed$: Observable<number>;
  public maxTilt$: Observable<number>;
  public drivingDuration$: Observable<number>;
  public pauseDuration$: Observable<number>;
  public speedZones$: Observable<{ zone: SpeedZone; distance: number }[]>
  public interpolateCheckbox = new FormControl();

  public showMapLabels$: Observable<boolean>;

  private subscriptions: Subscription[] = [];
  private interpolation = new BehaviorSubject<boolean>(false);
  private chartInstances?: {speed?: Chart, tilt?: Chart};

  @ViewChild('speedChart')
  private speedChart: ElementRef | undefined;

  @ViewChild('tiltChart')
  private tiltChart: ElementRef | undefined;

  constructor(private store: Store,
    private rideService: RideService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.ride$ = this.store.select(selectRide).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

    this.showMapLabels$ = this.store.select(selectUiState).pipe(
      map((state) => state.showLabels || false),
      distinctUntilChanged()
    )

    this.averageSpeed$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getSpeedArray),
      map(average),
      map(Math.round)
    );

    this.maxSpeed$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getSpeedArray),
      map(max),
      map(Math.round)
    );

    this.maxTilt$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getTiltArray),
      map(max),
      map(Math.round)
    );

    this.drivingDuration$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map((ride) => ride.logs),
      map((logs) => {
        let duration = 0;
        logs?.forEach((log, index) => {
          const next = logs[index + 1];
          if (next) {
            const hasMoved = (next.distance - log.distance) > 2; // less than 2 meters, considers that we did not yet move
            if (hasMoved) {
              duration += (next.gpsTimestamp - log.gpsTimestamp);
            }
          }
        });

        return Math.round(duration);
      })
    )

    this.pauseDuration$ = combineLatest([
      this.ride$.pipe(map((ride) => Math.round((ride.endDate.getTime() - ride.startDate.getTime())))),
      this.drivingDuration$
    ]).pipe(map(([totalDuration, drivingDuration]) => {
      return totalDuration - drivingDuration;
    }));



    this.speedZones$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map((ride) => ride.logs),
      map((logs) => {
        const output: { zone: SpeedZone; distance: number }[] = [];

        logs?.forEach((log, index) => {
          const next = logs[index + 1];
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
      })
    )
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.interpolateCheckbox.valueChanges.subscribe((change) => {
        this.interpolation.next(change);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  ngAfterViewInit(): void {
    
    this.subscriptions.push(
      combineLatest([
        this.ride$.pipe(map((ride) => ride.logs)),
        this.interpolation.asObservable()
      ]).subscribe(([logs, interpolation]) => {
        this.createCharts(logs!, interpolation);
      })
    );
  }

  private createCharts(logs: Log[], interpolation: boolean) {

    // Workaround: when chart is re-created, chartjs scroll top.
    // We keep current scroll position and reapply at the bottom
    const currentPageScroll = document.body.scrollTop || window.scrollY;

    // destroy charts if exist
    this.chartInstances?.speed?.destroy();
    this.chartInstances?.tilt?.destroy();

    this.chartInstances = createCharts(logs, interpolation, {
      speed: this.speedChart!.nativeElement,
      tilt: this.tiltChart!.nativeElement
    });


    // Scroll to previous position
    window.scroll(0, currentPageScroll);
  }


  public export(id: string) {
    this.subscriptions.push(
      this.rideService.export(id).pipe(take(1)).subscribe(
        result => {
          if (result) {
            this.snackBar.open('Ride has been sent to your email', undefined, {
              duration: 3000
            });
          }
        }
      )
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
