// src/app/auth/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Adjust path if needed
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 1. Add the access token to the original request
  let reqWithToken = addTokenHeader(req, authService.getToken());

  // 2. Pass the request to the next handler in the chain and catch potential errors
  return next(reqWithToken).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if it's a 401 Unauthorized error
      // And ensure it's not a request to the login, register, or refresh endpoint itself
      if (error.status === 401 &&
          !req.url.includes('/auth/login') &&
          !req.url.includes('/auth/registro') &&
          !req.url.includes('/auth/refresh-token')) {
        return handle401Error(req, next, authService);
      }
      // For any other error (or 401 from login/register/refresh), re-throw it
      return throwError(() => error);
    })
  );
};

/**
 * Helper function to clone the request and add the Authorization header.
 * @param request The original HttpRequest.
 * @param token The access token to add.
 * @returns A cloned HttpRequest with the Authorization header.
 */
function addTokenHeader(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (token) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return request;
}

/**
 * Handles a 401 Unauthorized error by attempting to refresh the token.
 * Manages concurrent refresh attempts.
 * @param request The original HttpRequest that failed.
 * @param next The next handler in the interceptor chain.
 * @param authService The injected AuthService instance.
 * @returns An Observable that emits the retried request or throws an error.
 */
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<any> {
  // Check if a token refresh is already in progress
  if (!authService.isRefreshing) {
    authService.isRefreshing = true; // Set flag to true
    authService.refreshTokenSubject.next(null); // Clear the subject, signifying a new refresh attempt

    // Initiate the token refresh process
    return authService.refreshToken().pipe(
      switchMap((authResponse: any) => {
        // Refresh token successful
        authService.isRefreshing = false; // Reset flag
        authService.refreshTokenSubject.next(authResponse.accessToken); // Emit the new access token
        // Retry the original failed request with the new access token
        return next(addTokenHeader(request, authResponse.accessToken));
      }),
      catchError((refreshError: any) => {
        // Refresh token failed (e.g., refresh token is invalid/expired)
        authService.isRefreshing = false; // Reset flag
        authService.logout(); // Log out the user
        // Propagate the refresh error to the component
        return throwError(() => refreshError);
      })
    );
  } else {
    // If a token refresh is already in progress, wait for it to complete
    return authService.refreshTokenSubject.pipe(
      filter(token => token !== null), // Wait until a new token is emitted (non-null)
      take(1), // Take only the first emitted new token
      switchMap(token => {
        // If the emitted token is null, it means the refresh attempt failed
        if (token === null) {
          // This path indicates the previous refresh attempt failed, so we throw an error
          return throwError(() => new Error('Token refresh failed while waiting.'));
        }
        // Retry the original request with the newly obtained token
        return next(addTokenHeader(request, token));
      })
    );
  }
}