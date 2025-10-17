import {
  Injectable,
  inject
} from "@angular/core"
import {
  ActivatedRouteSnapshot,
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
  upsertRide
} from "../../store"

@Injectable()
export class RideGuard implements CanActivate {
  private rideService = inject(RideService);
  private store = inject(Store);

  canActivate(
    route: ActivatedRouteSnapshot
  ): MaybeAsync<GuardResult> {

    const id = route.paramMap.get('id');
    if (id) {
      return this.rideService.getRide(id).pipe(
        map((ride) => {
          this.store.dispatch(upsertRide({ ride }));
          return true;
        })
      )
    }
    
    return false;
    
  }
}