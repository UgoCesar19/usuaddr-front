import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const spinnerService: SpinnerService = inject(SpinnerService);

  spinnerService.setRodando(true);

  return next(req).pipe(
    finalize(() => spinnerService.setRodando(false)) // Always hide when done
  );
};
