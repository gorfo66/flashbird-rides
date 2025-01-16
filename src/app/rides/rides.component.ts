import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRides } from '../../store';
import { map, Observable, Subscription } from 'rxjs';
import { Ride } from '../../models';

@Component({
  selector: 'app-rides-',
  standalone: false,
  
  templateUrl: './rides.component.html',
  styleUrl: './rides.component.scss'
})
export class RidesComponent implements AfterViewInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  public rides$: Observable<Ride[]>;
  public totalDistance$: Observable<number>;

  constructor(private store: Store) {
    this.rides$ = this.store.select(selectRides);
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

}
