import {
  ActionReducer,
  INIT,
  createReducer,
  on
} from '@ngrx/store'
import {
  Ride,
  RootState,
  UiState
} from '../models'
import {
  upsertAuthToken,
  upsertRide,
  upsertRides,
  upsertUiState
} from './actions'

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

export const hydrationMetaReducer = (
  reducer: ActionReducer<RootState>
): ActionReducer<RootState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const token = localStorage.getItem("token");
      const uiState = localStorage.getItem('uiState');
      if (token) {
        return {
          rides: undefined,
          ride: undefined,
          token,
          uiState: uiState ? JSON.parse(uiState) : {
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
      localStorage.setItem('uiState', JSON.stringify(nextState.uiState))
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