import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { distinctUntilChanged, filter, map, Observable, Subscription, take } from 'rxjs';
import { Log, Ride } from '../../models';
import { Store } from '@ngrx/store';
import { selectRide } from '../../store';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { average, getSpeedArray, getTiltArray, interpolate, max } from '../../helpers';
import { RideService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ride-',
  standalone: false,

  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss'
})
export class RideComponent implements AfterViewInit, OnDestroy {

  public ride$: Observable<Ride>;
  public averageSpeed$: Observable<number>;
  public maxSpeed$: Observable<number>;

  public averageTilt$: Observable<number>;
  public maxTilt$: Observable<number>;

  private subscriptions: Subscription[] = [];

  @ViewChild('map')
  map: ElementRef | undefined;

  @ViewChild('speedChart')
  speedChart: ElementRef | undefined;

  @ViewChild('tiltChart')
  tiltChart: ElementRef | undefined;

  constructor(private store: Store, private rideService: RideService, private snackBar: MatSnackBar) {
    this.ride$ = this.store.select(selectRide).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

    this.averageSpeed$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getSpeedArray),
      map(average),
      map(Math.floor)
    );

    this.maxSpeed$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getSpeedArray),
      map(max),
      map(Math.floor)
    );

    this.averageTilt$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getTiltArray),
      map(average),
      map(Math.floor)
    );

    this.maxTilt$ = this.ride$.pipe(
      filter((ride) => !!ride.logs),
      map(getTiltArray),
      map(max),
      map(Math.floor)
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.ride$.pipe(
        map((ride) => ride.logs)
      ).subscribe((logs) => {
        this.createMap(logs!);
        this.createCharts(logs!);
      })
    )
  }


  private createMap(logs: Log[]) {
    const L = (window as any).L;

    const lat = logs[0].latitude;
    const lon = logs[0].longitude;
    const map = L.map(this.map!.nativeElement);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: null,
      minZoom: 1,
      maxZoom: 20
    }).addTo(map);


    // Create the path
    const toUnion = logs.map((x) => {
      return [
        x.latitude,
        x.longitude
      ]
    });

    const path = L.polyline(toUnion, { color: 'var(--fb-red)', opacity: 1, weight: 5});
    path.addTo(map);
    map.fitBounds(path.getBounds());

  }



  private createCharts(logs: Log[]) {
    const style = getComputedStyle(document.body);
    const color = style.getPropertyValue('--fb-red');

    const interpolatedLogs = interpolate(logs);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        datasets: []
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          xAxis: {
            type: 'linear',
            position: 'bottom'
          },
          mainY: {
            beginAtZero: true,
            display: true,
            position: 'left',
          },
          altY: {
            display: false,
            position: 'right'
          }
        }
      }
    };

    const dataSetDefaultConfig = {
      cubicInterpolationMode: 'monotone',
      tension: 0.5,
      borderColor: color,
      backgroundColor: color,
      fill: false,
      yAxisID: 'mainY',
    }


    const altitudeDataSet = {
      ...dataSetDefaultConfig,
      yAxisID: 'altY',
      label: 'altitude',
      fill: true,
      backgroundColor: '#EEEEEE',
      borderColor: '#EEEEEE',
      data: interpolatedLogs.map((log: Log) => {
        return {
          x: log.distance / 1000,
          y: log.altitude
        }
      })
    }

    new Chart(this.speedChart?.nativeElement, {
      ...config,
      data: {
        datasets: [
          {
            ...dataSetDefaultConfig,
            label: 'Speed',
            data: interpolatedLogs.map((log: Log) => {
              return {
                x: log.distance / 1000,
                y: log.speed
              }
            })
          }, altitudeDataSet
        ]
      }
    });

    new Chart(this.tiltChart?.nativeElement, {
      ...config,
      data: {
        datasets: [
          {
            ...dataSetDefaultConfig,
            label: 'Tilt',
            data: interpolatedLogs.map((log: Log) => {
              return {
                x: log.distance / 1000,
                y: log.tilt
              }
            })
          },
          altitudeDataSet
        ]
      }
    });
  }


  public export(id: string) {
    this.subscriptions.push(
      this.rideService.export(id).pipe(take(1)).subscribe(
        result => {
          // Simple message.
          if (result) {
            this.snackBar.open('Ride has been sent to your email', undefined, {
              duration: 3000
            });
          }          
        }
      )
    )
  }
}
