import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, map, Observable } from "rxjs";
import { upsertUiState } from "../store";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private store: Store) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.dispatch(upsertUiState({ uiState: { isPending: true} }));
    return next.handle(request).pipe(
      map((response) => {
        if (response instanceof HttpResponse) {
          this.store.dispatch(upsertUiState({ uiState: { isPending: false} }))
        }
        return response;
      }),
      catchError((err) => {
        this.store.dispatch(upsertUiState({ uiState: { isPending: false} }))
        throw err;
      }));
  }
}