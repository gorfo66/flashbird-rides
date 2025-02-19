import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectUiState } from '../store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  public isPending$: Observable<boolean>;

  constructor(private store: Store) {
    this.isPending$ = this.store.select(selectUiState).pipe(
      map((uiState) => uiState?.isPending || false));
  }
  
}
