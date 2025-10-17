import {
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core'
import {
  Store
} from '@ngrx/store'
import {
  selectRides,
  selectUiState,
  upsertUiState
} from '../../store'
import {
  Observable,
  Subscription,
  combineLatest,
  map,
  take
} from 'rxjs'
import {
  Ride
} from '../../models'
import {
  FormBuilder,
  FormGroup
} from '@angular/forms'

export enum FilterType {
  all = 'all', 
  long = 'long'
}


@Component({
  selector: 'app-rides',
  standalone: false,
  
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.scss'
})
export class RidesComponent implements OnDestroy, OnInit {
  private store = inject(Store);


  private subscriptions: Subscription[] = [];
  private currentFilter$: Observable<string>;

  public rides$: Observable<Ride[]>;
  public filteredRides$: Observable<Ride[]>;
  public totalDistance$: Observable<number>;
  public distancePerMonth$: Observable<number>;
  public readonly filterForm: FormGroup
 
  constructor() {
    const formBuilder = inject(FormBuilder);

    this.rides$ = this.store.select(selectRides);
    this.currentFilter$ = this.store.select(selectUiState).pipe(map((uiState) => uiState.filter || FilterType.all));

    this.filteredRides$ = combineLatest([
      this.store.select(selectRides),
      this.currentFilter$
    ]).pipe(
      map( ([rides, filterType]) => {
        return rides.filter((ride) => filterType === FilterType.all || ride.distance > 100000);
      })
    );
    this.totalDistance$ = this.rides$.pipe(map((rides) => Math.floor(rides.reduce((a, b) => a + b.distance, 0) / 1000)))
    this.distancePerMonth$ = combineLatest([
      this.rides$,
      this.totalDistance$
    ]).pipe(
      map(([rides, totalDistance]) => {
        const lastDate = rides[0].startDate;
        const firstDate = rides[rides.length - 1].endDate;
        const elapsedTime = lastDate.getTime() - firstDate.getTime();
        const oneMonthAverageDurationInMs = (365.25 / 12) * 24 * 3600 * 1000;
        const elapsedTimeInMonth = elapsedTime / oneMonthAverageDurationInMs;
        return Math.floor(totalDistance / elapsedTimeInMonth);
      })
    )

    this.filterForm = formBuilder.group({
      filter: ''
    });

    this.subscriptions.push(
      this.filterForm.valueChanges.subscribe((change) => {
        if (change.filter) {
          this.store.dispatch(upsertUiState({uiState : { filter: change.filter}}));
        }
      })
    );
  }

  ngOnInit(): void {
   
    this.subscriptions.push(
      this.currentFilter$.pipe(take(1)).subscribe((value) => {
        this.filterForm.controls['filter'].setValue(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  public formatDistance(distance: number) {
    return Math.floor(distance / 1000) + ' km';
  }


  get FilterType() {
    return FilterType;
  }
}
