import {
  bootstrapApplication
} from '@angular/platform-browser'
import {
  provideZoneChangeDetection
} from "@angular/core"
import {
  AppComponent
} from './app/app.component'
import {
  provideRouter
} from '@angular/router'
import {
  routes
} from './app/app.routes'
import {
  provideAnimationsAsync
} from '@angular/platform-browser/animations/async'
import {
  provideStore
} from '@ngrx/store'
import {
  metaReducers,
  reducers
} from './store'
import {
  provideStoreDevtools
} from '@ngrx/store-devtools'
import {
  isDevMode
} from '@angular/core'
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http'
import {
  httpInterceptorProviders
} from './interceptors'
import {
  LOCALE_ID
} from '@angular/core'
import {
  provideAppInitializer
} from '@angular/core'
import {
  inject
} from '@angular/core'
import {
  PromptUpdateService
} from './services'
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS
} from '@angular/material/form-field'
import {
  MAT_CARD_CONFIG
} from '@angular/material/card'
import localeFr from '@angular/common/locales/fr'
import {
  registerLocaleData
} from '@angular/common'
import {
  provideServiceWorker
} from '@angular/service-worker'
import {
  RidesGuard,
  RideGuard
} from './app'

registerLocaleData(localeFr, 'fr');

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(reducers, { metaReducers }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(withInterceptors([])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:20000'
    }),
    httpInterceptorProviders,
    RidesGuard,
    RideGuard,
    provideAppInitializer(() => {
      inject(PromptUpdateService);
    }),
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance: 'outline',
        floatLabel: 'always'}},
    {provide: MAT_CARD_CONFIG,
      useValue : {appearance: 'outlined'}},
    { provide: LOCALE_ID,
      useValue: 'fr-FR'}
  ]
}).catch(err => console.error(err));
