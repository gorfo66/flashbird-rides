import { createAction, props } from "@ngrx/store";
import { Ride, UiState } from "../models";

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

export const upsertUiState = createAction(
  '[Ui] upsert state',
  props<{ uiState: UiState }>()
);