import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom, from, lastValueFrom, Observable } from "rxjs";
import { AuthenticationService, flashbirdUrl } from "../services";
import { Store } from "@ngrx/store";
import { selectToken, upsertAuthToken } from "../store";

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

  constructor(private router: Router, private store: Store, private authService: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // convert promise to observable using 'from' operator
    return from(this.handle(request, next));
  }


  async handle(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url === flashbirdUrl && !/SignInWithEmailAndPassword/gi.test(request.body as string)) {
      const token = await firstValueFrom(this.store.select(selectToken));

      if (!token || !this.authService.checkValidity(token)) {
        this.store.dispatch(upsertAuthToken({ token: undefined }));
        this.router.navigate(['login']);
      }

      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    return lastValueFrom(next.handle(request));
  }




}