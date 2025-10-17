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
  map
} from "rxjs"
import {
  RideService
} from "../../services"
import {
  Store
} from "@ngrx/store"
import {
  upsertRides
} from "../../store"

@Injectable()
export class RidesGuard implements CanActivate {
  private rideService = inject(RideService);
  private store = inject(Store);

  canActivate(): MaybeAsync<GuardResult> {

    return this.rideService.getRides().pipe(
      map((rides) => {
        this.store.dispatch(upsertRides({ rides }));
        return true;
      })
    )

  }
}