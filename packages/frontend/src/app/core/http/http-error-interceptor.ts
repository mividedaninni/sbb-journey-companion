import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, Subject } from 'rxjs';

export const ERROR_NOTIFIER = new Subject<string>();

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((error: HttpErrorResponse) => handleError(error)));
};

const handleError = (error: HttpErrorResponse) => {
  let userMessage = 'An unexpected error occurred.';

  if (error.error) {
    if (error.error instanceof ErrorEvent) {
      userMessage = `Client error: ${error.error.message}`;
    } else {
      userMessage = error.error.message;
    }
  }

  ERROR_NOTIFIER.next(userMessage);
  throw error;
};
