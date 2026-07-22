import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '~env/environment';

import { AUTH_PORT } from './auth.port';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.authMode !== 'backend') {
    return next(req);
  }
  return next(req.clone({ withCredentials: true }));
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (environment.authMode !== 'backend') {
    return next(req);
  }

  const auth = inject(AUTH_PORT);
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
