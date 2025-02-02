import { createFeatureSelector } from "@ngrx/store";
import { Ride, UiState } from "../models";

export const selectRides = createFeatureSelector<Ride[]>('rides');
export const selectRide = createFeatureSelector<Ride>('ride');
export const selectToken = createFeatureSelector<string>('token');
export const selectUiState = createFeatureSelector<UiState>('uiState');
