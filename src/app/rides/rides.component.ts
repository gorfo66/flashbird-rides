import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRides, selectUiState, upsertUiState } from '../../store';
import { BehaviorSubject, combineLatest, map, Observable, Subscription } from 'rxjs';
import { Ride } from '../../models';

export enum FilterType {
  all = 'all', 
  long = 'long'
}


@Component({
  selector: 'app-rides-',
  standalone: false,
  
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.scss'
})
export class RidesComponent implements AfterViewInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  public rides$: Observable<Ride[]>;
  public filteredRides$: Observable<Ride[]>;
  public totalDistance$: Observable<number>;
 
  constructor(private store: Store) {
    this.rides$ = this.store.select(selectRides);

    this.filteredRides$ = combineLatest([
      this.store.select(selectRides),
      this.store.select(selectUiState).pipe(map((uiState) => uiState.filter))
    ]).pipe(
      map( ([rides, filterType]) => {
        return rides.filter((ride) => filterType === FilterType.all || ride.distance > 100000);
      })
    );
    this.totalDistance$ = this.rides$.pipe(map((rides) => Math.floor(rides.reduce((a, b) => a + b.distance, 0) / 1000)))
  }

  public formatDistance(distance: number) {
    return Math.floor(distance / 1000) + ' km';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  ngAfterViewInit(): void {
    
  }

  public filter(type: FilterType):void {
    this.store.dispatch(upsertUiState({uiState : { filter: type}}));
  }

  get FilterType() {
    return FilterType;
  }
}
