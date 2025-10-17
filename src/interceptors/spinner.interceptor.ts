import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http"
import {
  Injectable,
  inject
} from "@angular/core"
import {
  Store
} from "@ngrx/store"
import {
  Observable,
  catchError,
  map
} from "rxjs"
import {
  upsertUiState
} from "../store"

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  private store = inject(Store);

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