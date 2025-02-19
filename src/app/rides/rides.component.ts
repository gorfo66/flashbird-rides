import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRides, selectUiState, upsertUiState } from '../../store';
import { combineLatest, map, Observable, Subscription, take } from 'rxjs';
import { Ride } from '../../models';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  private subscriptions: Subscription[] = [];
  private currentFilter$: Observable<string>;

  public rides$: Observable<Ride[]>;
  public filteredRides$: Observable<Ride[]>;
  public totalDistance$: Observable<number>;
  public readonly filterForm: FormGroup
 
  constructor(private store: Store, formBuilder: FormBuilder) {
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

    this.filterForm = formBuilder.group({
      filter: ''
    });
  }

  ngOnInit(): void {
   
    this.subscriptions.push(
      this.currentFilter$.pipe(take(1)).subscribe((value) => {
        this.filterForm.controls['filter'].setValue(value);
      })
    );

    this.subscriptions.push(
      this.filterForm.valueChanges.subscribe((change) => {
        if (change.filter) {
          this.store.dispatch(upsertUiState({uiState : { filter: change.filter}}));
        }
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
