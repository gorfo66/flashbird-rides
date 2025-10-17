import {
  LOCALE_ID,
  NgModule,
  inject,
  isDevMode,
  provideAppInitializer
} from '@angular/core'
import {
  BrowserModule
} from '@angular/platform-browser'

import {
  AppRoutingModule
} from './app-routing.module'
import {
  AppComponent
} from './app.component'
import {
  httpInterceptorProviders
} from '../interceptors'
import {
  StoreModule
} from '@ngrx/store'
import {
  metaReducers,
  reducers
} from '../store'
import {
  RideModule
} from './ride/ride.module'
import {
  StoreDevtoolsModule
} from '@ngrx/store-devtools'
import {
  RidesModule
} from './rides'
import {
  provideAnimationsAsync
} from '@angular/platform-browser/animations/async'
import {
  LoginModule
} from './login/login.module'
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS
} from '@angular/material/form-field'
import {
  MAT_CARD_CONFIG
} from '@angular/material/card'
import {
  ServiceWorkerModule
} from '@angular/service-worker'
import {
  PromptUpdateService
} from '../services'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RidesModule,
    RideModule,
    LoginModule,
    StoreModule.forRoot(reducers, { metaReducers}),
    StoreDevtoolsModule.instrument({ maxAge: 25,
      logOnly: !isDevMode() }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:20000'
    }),
  ],
  providers: [
    httpInterceptorProviders,
    provideAnimationsAsync(),
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
