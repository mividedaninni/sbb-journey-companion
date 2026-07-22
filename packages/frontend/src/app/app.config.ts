import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthResponseDto } from '@sbb-journey-companion/common';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '~env/environment';

import { routes } from './app.routes';
import { authInterceptor, credentialsInterceptor } from './core/auth/auth-interceptor';
import { AUTH_PORT } from './core/auth/auth.port';
import { AuthService } from './core/auth/auth.service';
import { BackendAuthService } from './core/auth/backend-auth.service';
import { httpBaseInterceptor } from './core/http/http-base-interceptor';
import { httpErrorInterceptor } from './core/http/http-error-interceptor';
import { loaderInterceptor } from './core/loader/loader-interceptor';

export const activeSessionKey = 'active_session';
export const activeSessionValue = 'true';

function authInitializer(): () => Promise<void> {
  return async (): Promise<void> => {
    const auth = inject(AUTH_PORT);
    if (!sessionStorage.getItem(activeSessionKey)) {
      return;
    }

    try {
      await firstValueFrom(
        auth.refresh().pipe(
          catchError(() => {
            auth.logout();
            return of(null as unknown as AuthResponseDto);
          }),
        ),
      );
    } catch (error) {
      console.error('provideAppInitializer: Unexpected error during refresh:', error);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: AUTH_PORT,
      useFactory: () =>
        environment.authMode === 'backend' ? inject(BackendAuthService) : inject(AuthService),
    },
    provideAppInitializer(authInitializer()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        httpBaseInterceptor,
        httpErrorInterceptor,
        authInterceptor,
        loaderInterceptor,
        credentialsInterceptor,
      ]),
    ),
  ],
};
