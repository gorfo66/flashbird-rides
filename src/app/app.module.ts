import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from '../interceptors';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from '../store';
import { RideModule } from './ride/ride.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RidesModule } from './rides';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginModule } from './login/login.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RidesModule,
    RideModule,
    LoginModule,
    StoreModule.forRoot(reducers, { metaReducers}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    httpInterceptorProviders,
    provideAnimationsAsync(),
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline', floatLabel: 'always'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
