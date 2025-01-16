import { createFeatureSelector } from "@ngrx/store";
import { Ride } from "../models";

export const selectRides = createFeatureSelector<Ride[]>('rides');
export const selectRide = createFeatureSelector<Ride>('ride');
export const selectToken = createFeatureSelector<string>('token');
export const selectPendingState = createFeatureSelector<boolean>('pendingState');
