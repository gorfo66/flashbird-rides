import {
  Ride
} from "./ride"

export interface UiState {
  isPending?: boolean;
  filter?: string;
  showLabels?: boolean;
  errorMessage?: string;
}

export interface RootState {
  token: string | undefined;
  uiState: UiState;
  rides: Ride[] | undefined;
  ride: Ride | undefined
}