import {
  bootstrapApplication
} from '@angular/platform-browser'
import {
  inject,
  isDevMode,
  LOCALE_ID,
  provideAppInitializer,
  Provider,
  provideZonelessChangeDetection
} from "@angular/core"
import {
  AppComponent
} from './app/app.component'
import {
  provideAnimationsAsync
} from '@angular/platform-browser/animations/async'
import localeFr from '@angular/common/locales/fr'
import {
  registerLocaleData
} from '@angular/common'
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  MAT_CARD_CONFIG
} from '@angular/material/card';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS
} from '@angular/material/form-field';
import {
  provideRouter
} from '@angular/router';
import {
  provideServiceWorker
} from '@angular/service-worker';
import {
  provideStore
} from '@ngrx/store';
import {
  RidesGuard,
  RideGuard
} from './app';
import {
  routes
} from './app/app.routes';
import {
  httpInterceptorProviders
} from './interceptors';
import {
  PromptUpdateService
} from './services';
import {
  reducers,
  metaReducers,
  effects
} from './store';
import {
  ngrxDevtools
} from './devtools';
import {
  provideEffects
} from '@ngrx/effects';

registerLocaleData(localeFr, 'fr');

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes) as unknown as Provider,
    provideStore(reducers, { metaReducers }) as unknown as Provider,
    provideEffects(effects),
    ngrxDevtools,
    provideHttpClient(withInterceptors([])) as unknown as Provider,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:20000'
    }) as unknown as Provider,
    httpInterceptorProviders,
    RidesGuard,
    RideGuard,
    provideAppInitializer(() => {
      inject(PromptUpdateService);
    }) as unknown as Provider,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance: 'outline',
        floatLabel: 'always'}},
    {provide: MAT_CARD_CONFIG,
      useValue : {appearance: 'outlined'}},
    { provide: LOCALE_ID,
      useValue: 'fr-FR'}
  ]
}).catch(err => console.error(err));
