import { ActionReducer, createReducer, INIT, on } from '@ngrx/store';
import { upsertAuthToken, upsertRide, upsertRides, upsertUiState } from './actions';
import { Ride, UiState } from '../models';
import { Action } from 'rxjs/internal/scheduler/Action';
import { merge } from 'rxjs';

export const ridesReducer = createReducer<Ride[] | undefined>(
  undefined,
  on(upsertRides, (_state, { rides }) => rides)
);

export const rideReducer = createReducer<Ride | undefined>(
  undefined,
  on(upsertRide, (_state, { ride }) => ride)
);

export const tokenReducer = createReducer<string | undefined>(
  undefined,
  on(upsertAuthToken, (_state, { token }) => token)
);

export const uiStateReducer = createReducer<UiState>(
  {
    isPending: false,
    filter: 'all'
  },
  on(upsertUiState, (state, { uiState }) => ({
    ...state,
    ...uiState
  }))
);

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const hydrationMetaReducer = (
  reducer: ActionReducer<any>
): ActionReducer<any> => {
  return (state, action) => {
    if (action.type === INIT) {
      const token = localStorage.getItem("token");
      if (token) {
        return {
          token,
          uiState: {
            isPending: false,
            filter: 'all'
          }
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.removeItem("token");
    if (nextState.token) {
      localStorage.setItem("token", nextState.token);
    }
    return nextState;
  };
};

export const reducers = { 
  rides: ridesReducer, 
  ride: rideReducer, 
  token: tokenReducer,
  uiState: uiStateReducer
}

export const metaReducers = [ hydrationMetaReducer ];