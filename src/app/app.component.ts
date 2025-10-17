import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core'
import {
  Store
} from '@ngrx/store'
import {
  Observable,
  map
} from 'rxjs'
import {
  selectUiState
} from '../store'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private store = inject(Store);

  public isPending$: Observable<boolean>;

  constructor() {
    this.isPending$ = this.store.select(selectUiState).pipe(
      map((uiState) => uiState?.isPending || false));
  }
  
}
