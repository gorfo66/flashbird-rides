import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http'
import {
  AuthHeaderInterceptor
} from './auth.interceptor'
import {
  SpinnerInterceptor
} from './spinner.interceptor'
import {
  ContentTypeInterceptor
} from './content-type.interceptor'

/** Array of Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  provideHttpClient(withInterceptorsFromDi()),
  { provide: HTTP_INTERCEPTORS,
    useClass: ContentTypeInterceptor,
    multi: true },
  { provide: HTTP_INTERCEPTORS,
    useClass: AuthHeaderInterceptor,
    multi: true },
  { provide: HTTP_INTERCEPTORS,
    useClass: SpinnerInterceptor,
    multi: true },
];