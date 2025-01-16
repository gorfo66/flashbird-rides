import { createAction, props } from "@ngrx/store";
import { Ride } from "../models";

export const upsertAuthToken = createAction(
  '[Auth] Upsert token',
  props<{ token: string | undefined }>()
);

export const upsertRides = createAction(
  '[Ride] upsert ride list',
  props<{ rides: Ride[] }>()
);

export const upsertRide = createAction(
  '[Ride] upsert ride',
  props<{ ride: Ride }>()
);

export const upsertPendingState = createAction(
  '[Pending] upsert state',
  props<{ isPending: boolean }>()
);