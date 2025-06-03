import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

export const feedbackInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const toast = inject(ToastService);

  return next(req).pipe(
    // Intercept success responses
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Example: show success for POST or PUT
        if (['POST', 'PUT'].includes(req.method)) {
          toast.success('Success');
        }
      }
    }),

    // Intercept errors
    catchError((error: HttpErrorResponse) => {
      console.log(JSON.stringify(error));
      const message = error.error?.[0]?.menssage || 'Something went wrong';
      toast.error(message, 'Error');
      return throwError(() => error);
    })
  );
};
