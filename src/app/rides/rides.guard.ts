import { Injectable } from "@angular/core";
import { CanActivate, GuardResult, MaybeAsync } from "@angular/router";
import { map } from "rxjs";
import { RideService } from "../../services";
import { Store } from "@ngrx/store";
import { upsertRides } from "../../store";

@Injectable()
export class RidesGuard implements CanActivate {
  constructor(private rideService: RideService, private store: Store) { }

  canActivate(): MaybeAsync<GuardResult> {

    return this.rideService.getRides().pipe(
      map((rides) => {
        this.store.dispatch(upsertRides({ rides }));
        return true;
      })
    )

  }
}