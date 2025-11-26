import { provideZoneChangeDetection } from "@angular/core";
import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic'
import {
  AppModule
} from './app/app.module'
import localeFr from '@angular/common/locales/fr';
import {
  registerLocaleData
} from '@angular/common'

platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })], })
  .catch(err => console.error(err));


registerLocaleData(localeFr, 'fr');