import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RideService } from '../services/flashbird/ride.service';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable } from 'rxjs';
import { selectPendingState } from '../store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public isPending$: Observable<boolean>;

  constructor(private store: Store) {
    this.isPending$ = this.store.select(selectPendingState).pipe(distinctUntilChanged());
  }

  ngOnInit(): void {

  }
  
}
