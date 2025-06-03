import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorFeedbackInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        alert('Connection error. Please check your network.');
      } else if (error.status >= 500) {
        alert('Server error. Please try again later.');
      } else if (error.status === 400 && error.error) {
        alert("Bad request: " + JSON.stringify(error.error));
      } else {
        alert("Error code: " + error.status + ". Message: " + JSON.stringify(error.error));
      }

      return throwError(() => error);
    })
  );
};
