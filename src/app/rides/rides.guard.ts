import {
  Injectable,
  inject
} from "@angular/core"
import {
  CanActivate,
  GuardResult,
  MaybeAsync
} from "@angular/router"
import {
  filter,
  map,
} from "rxjs"
import {
  Store
} from "@ngrx/store"
import {
  fetchRides,
  selectRides,
} from "../../store"

@Injectable()
export class RidesGuard implements CanActivate {
  private store = inject(Store);

  canActivate(): MaybeAsync<GuardResult> {
    this.store.dispatch(fetchRides());
    return this.store.select(selectRides).pipe(
      filter(rides => !!rides),
      map(() => true)
    );
  }
}