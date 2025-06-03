import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorFeedbackInterceptor } from './interceptors/error-feedback.interceptor';
import { spinnerInterceptor } from './interceptors/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorFeedbackInterceptor,
        spinnerInterceptor
      ])),
    provideRouter(routes)
  ]
};
