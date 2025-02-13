import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, Subscription, take } from 'rxjs';
import { Log, Ride } from '../../models';
import { Store } from '@ngrx/store';
import { selectRide } from '../../store';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { average, getSpeedArray, getTiltArray, interpolate, max } from '../../helpers';
import { RideService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

// @ts-ignore
import * as L from "leaflet/dist/leaflet-src.esm";


@Component({
  selector: 'app-ride-',
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
  public interpolateCheckbox = new FormControl()
  

  private subscriptions: Subscription[] = [];
  private interpolation = new BehaviorSubject<boolean>(false);
  private speedChartInstance: any;
  private tiltChartInstance: any;

  @ViewChild('map')
  private map: ElementRef | undefined;

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
            else {
              console.log('did not move');
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
      this.ride$.pipe(
        map((ride) => ride.logs)
      ).subscribe((logs) => {
        this.createMap(logs!);
      })
    );
    
    this.subscriptions.push(
      combineLatest([
        this.ride$.pipe(map((ride) => ride.logs)),
        this.interpolation.asObservable()
      ]).subscribe(([logs, interpolation]) => {
        this.createCharts(logs!, interpolation);
      })
    );
  }


  private createMap(logs: Log[]) {

    const lat = logs[0].latitude;
    const lon = logs[0].longitude;
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
      style: function(feature: any) {
        const speed = feature.properties.speed;
        const defaultStyle = {
          weight: 5
        }
        if (speed > 90) {
          return {
            ...defaultStyle,
            color: 'red'
          };
        }

        if (speed > 50) {
          return {
            ...defaultStyle,
            color: 'darkorange'
          };
        }
        
        return {
          ...defaultStyle,
          color: 'blue'
        }

      }
      });
   
      path.addTo(map);

    map.fitBounds(path.getBounds());

  }



  private createCharts(logs: Log[], interpolation: boolean) {

    // Workaround: when chart is re-created, chartjs scroll top.
    // We keep current scroll position and reapply at the bottom
    const currentPageScroll = document.body.scrollTop || window.scrollY;
    
    // destroy charts if exist
    if (this.speedChartInstance) {
      this.speedChartInstance.destroy();
    }

    if (this.tiltChartInstance) {
      this.tiltChartInstance.destroy();
    }

    const style = getComputedStyle(document.body);
    const lightDarkColor = style.getPropertyValue('--mat-sys-primary');
    const colorSplit = lightDarkColor.match(/^light-dark\((.*)\,(.*)\)$/);
    const color = colorSplit![1];

    
    const interpolatedLogs = interpolation ? interpolate(logs) : logs;

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
          },
          title: {
            display: true,
            text: 'Custom Chart Title'
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
      borderWidth: 1,
      borderColor: color,
      backgroundColor: function(context: any) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return;
        }

        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(1, color);
        gradient.addColorStop(0, color + '30');

        return gradient;
      },
      fill: true,
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

    const speedConfig = {
      ...config
    }
    speedConfig.options!.plugins!.title!.text = 'Vitesse';
    this.speedChartInstance = new Chart(this.speedChart?.nativeElement, {
      ...speedConfig,
      data: {
        datasets: [
          {
            ...dataSetDefaultConfig,
            label: 'Speed',
            data: interpolatedLogs.map((log: Log) => {
              return {
                x: log.distance / 1000,
                y: Math.round(log.speed)
              }
            })
          }, altitudeDataSet
        ]
      }
    });

    const tiltConfig = {
      ...config
    }
    tiltConfig.options!.plugins!.title!.text = 'Angle';
    this.tiltChartInstance = new Chart(this.tiltChart?.nativeElement, {
      ...tiltConfig,
      data: {
        datasets: [
          {
            ...dataSetDefaultConfig,
            label: 'Tilt',
            data: interpolatedLogs.map((log: Log) => {
              return {
                x: log.distance / 1000,
                y: Math.round(log.tilt)
              }
            })
          },
          altitudeDataSet
        ]
      }
    });


    // Scroll to previous position
    window.scroll(0,currentPageScroll);
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
}
