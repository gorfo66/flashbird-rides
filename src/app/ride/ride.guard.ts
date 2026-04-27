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
  filter,
  map
} from "rxjs"
import {
  Store
} from "@ngrx/store"
import {
  fetchRide,
  fetchRideUnion,
  selectRide,
} from "../../store"

@Injectable()
export class RideGuard implements CanActivate {
  private store = inject(Store);

  canActivate(
    route: ActivatedRouteSnapshot
  ): MaybeAsync<GuardResult> {

    const id = route.paramMap.get('id');
    if (id) {

      const ids = id.split('+');
      if (ids.length > 1) {
        this.store.dispatch(fetchRideUnion({ rideIds: ids }));
      }
      else {
        this.store.dispatch(fetchRide({ rideId: id }));
      }
      
      return this.store.select(selectRide).pipe(
        filter( ride => !!ride),
        map(() => true)
      )
    }
    
    return false;
    
  }
}