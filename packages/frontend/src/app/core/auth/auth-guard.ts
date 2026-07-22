import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AUTH_PORT } from './auth.port';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AUTH_PORT);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.parseUrl('/login');
};

export const loginAuthGuard: CanActivateFn = () => {
  const authService = inject(AUTH_PORT);
  const router = inject(Router);

  return authService.isLoggedIn() ? router.parseUrl('/dashboard') : true;
};
