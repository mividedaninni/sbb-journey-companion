import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({ withCredentials: true });
  return next(modifiedReq);
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const isAuthEndpoint = req.url.includes('/auth/');

  const authReq =
    token && !isAuthEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && auth.isLoggedIn() && !isAuthEndpoint) {
        return auth.refresh().pipe(
          switchMap(() => {
            return next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${auth.token}` },
              }),
            );
          }),
        );
      }

      return throwError(() => err);
    }),
  );
};
