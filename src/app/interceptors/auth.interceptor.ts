import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  let reqWithToken = addTokenHeader(req, authService.getTokens()?.tokenAcesso);

  return next(reqWithToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 &&
          !req.url.includes('/login') &&
          !req.url.includes('/register')) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(request: HttpRequest<unknown>, token: string | undefined): HttpRequest<unknown> {
  if (token) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return request;
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<any> {

  return authService.refreshToken().pipe(
    switchMap((response: AuthResponse) => {
      authService.setTokens(response);
      let novoToken = authService.getTokens()?.tokenAcesso;
      if (novoToken)
        return next(addTokenHeader(request, novoToken));
      return throwError(() => new Error('Token refresh failed while waiting.'));
    }),
    catchError((refreshError: any) => {
      authService.logout();
      return throwError(() => refreshError);
    })
  );

}