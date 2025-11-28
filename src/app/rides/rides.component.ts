import {
  Component,
  computed,
  effect,
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
  toSignal
} from '@angular/core/rxjs-interop'
import {
  map
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
export class RidesComponent {
  private store = inject(Store);

  public rides = toSignal(
    this.store.select(selectRides),
    { initialValue: [] }
  );

  public currentFilter = toSignal(
    this.store.select(selectUiState).pipe(map((uiState) => uiState?.filter || FilterType.all)),
    { initialValue: FilterType.all }
  );

  public filteredRides = computed(() => {
    const rides = this.rides();
    const filterType = this.currentFilter() || FilterType.all;
    if (!rides || !Array.isArray(rides)) return [];
    return rides.filter((ride: Ride) => filterType === FilterType.all || ride.distance > 100000);
  });

  public totalDistance = computed(() => {
    const rides = this.rides();
    if (!rides || rides.length === 0) return 0;
    return Math.floor(rides.reduce((a: number, b: Ride) => a + b.distance, 0) / 1000);
  });

  public distancePerMonth = computed(() => {
    const rides = this.rides();
    const totalDistance = this.totalDistance();
    if (!rides || rides.length === 0) return 0;
    const lastDate = rides[0].startDate;
    const firstDate = rides[rides.length - 1].endDate;
    const elapsedTime = lastDate.getTime() - firstDate.getTime();
    const oneMonthAverageDurationInMs = (365.25 / 12) * 24 * 3600 * 1000;
    const elapsedTimeInMonth = elapsedTime / oneMonthAverageDurationInMs;
    return Math.floor(totalDistance / elapsedTimeInMonth);
  });

  public readonly filterForm: FormGroup
 
  constructor() {
    const formBuilder = inject(FormBuilder);

    this.filterForm = formBuilder.group({
      filter: ''
    });

    // Initialize filter form with current filter value
    effect(() => {
      const currentFilter = this.currentFilter();
      this.filterForm.controls['filter'].setValue(currentFilter, { emitEvent: false });
    });

    // Handle filter form changes
    this.filterForm.valueChanges.subscribe((change) => {
      if (change.filter) {
        this.store.dispatch(upsertUiState({uiState : { filter: change.filter}}));
      }
    });
  }

  public formatDistance(distance: number) {
    return Math.floor(distance / 1000) + ' km';
  }


  get FilterType() {
    return FilterType;
  }
}
