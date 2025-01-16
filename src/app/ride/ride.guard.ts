import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { map, of } from "rxjs";
import { RideService } from "../../services";
import { Store } from "@ngrx/store";
import { upsertRide } from "../../store";

@Injectable()
export class RideGuard implements CanActivate {
  constructor(private rideService: RideService, private store: Store) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
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