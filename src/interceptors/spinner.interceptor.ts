import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Observable } from "rxjs";
import { upsertPendingState } from "../store";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private store: Store) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.dispatch(upsertPendingState({ isPending: true }));
    return next.handle(request).pipe(
      map((response) => {
        if (response instanceof HttpResponse) {
          this.store.dispatch(upsertPendingState({ isPending: false }))
        }
        return response;
      }));
  }
}