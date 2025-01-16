import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { map, of } from "rxjs";
import { RideService } from "../../services";
import { Store } from "@ngrx/store";
import { upsertRides } from "../../store";

@Injectable()
export class RidesGuard implements CanActivate {
  constructor(private rideService: RideService, private store: Store) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {

    return this.rideService.getRides().pipe(
      map((rides) => {
        this.store.dispatch(upsertRides({ rides }));
        return true;
      })
    )

  }
}