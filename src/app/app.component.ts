import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import {
  CommonModule
} from '@angular/common'
import {
  RouterModule
} from '@angular/router'
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
  standalone: true,
  imports: [CommonModule, RouterModule],
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
