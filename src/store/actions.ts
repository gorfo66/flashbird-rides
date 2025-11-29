import {
  Ride,
  UiState
} from "../models"
import {
  createAction,
  props
} from "@ngrx/store"

export const upsertAuthToken = createAction(
  '[Auth] Upsert token',
  props<{ token: string | undefined }>()
);

export const upsertRides = createAction(
  '[Ride] upsert rides list',
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

export const fetchRide = createAction(
  '[Ride] fetch ride',
  props<{ rideId: string }>()
);

export const fetchRides = createAction(
  '[Ride] fetch rides list'
);

export const login = createAction(
  '[Auth] Login',
  props<{ login: string, password: string}>()
);