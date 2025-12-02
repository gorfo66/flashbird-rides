import {
  inject
} from '@angular/core';
import {
  Actions,
  createEffect,
  ofType
} from '@ngrx/effects';
import {
  map,
  switchMap
} from 'rxjs';
import {
  AuthenticationService,
  RideService
} from '../services';
import {
  fetchRide,
  fetchRides,
  login,
  upsertAuthToken,
  upsertRide,
  upsertRides,
  upsertUiState
} from './actions';

export const fetchRidesEffect$ = createEffect(
  (actions$ = inject(Actions), rideService = inject(RideService)) => {
    return actions$.pipe(
      ofType(fetchRides),
      switchMap(() => rideService.getRides()),
      map((rides) => upsertRides({ rides }))
    );
  },
  { functional: true }
);

export const fetchRideEffect$ = createEffect(
  (actions$ = inject(Actions), rideService = inject(RideService)) => {
    return actions$.pipe(
      ofType(fetchRide),
      switchMap((action) => rideService.getRide(action.rideId)),
      map((ride) => upsertRide({ ride }))
    );
  },
  { functional: true }
);

export const loginEffectResetMessage$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(login),
      map(() => upsertUiState({ uiState: { errorMessage: '' }}))
    )
  },
  { functional: true }
);

export const loginEffect$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthenticationService)) => {
    return actions$.pipe(
      ofType(login),
      switchMap((action) => {
        upsertUiState({
          uiState: {
            errorMessage: ''
          }
        });
        return authService.getToken(action.login, action.password)
      }),
      map((reply) => {
        if (reply.error) {
          return upsertUiState({
            uiState: {
              errorMessage: reply.error
            } 
          })
        }
        
        return upsertAuthToken({ token: reply.token })
        
      })
    );
  },
  { functional: true }
);



export const effects = {
  fetchRidesEffect$,
  fetchRideEffect$,
  loginEffect$,
  loginEffectResetMessage$
};