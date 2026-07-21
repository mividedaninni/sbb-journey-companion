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

import { routes } from './app.routes';
import { authInterceptor, credentialsInterceptor } from './core/auth/auth-interceptor';
import { AuthService } from './core/auth/auth.service';
import { httpErrorInterceptor } from './core/http/http-error-interceptor';
import { loaderInterceptor } from './core/loader/loader-interceptor';

export const activeSessionKey = 'active_session';
export const activeSessionValue = 'true';

function authInitializer(): () => Promise<void> {
  return async (): Promise<void> => {
    const auth = inject(AuthService);
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
    provideAppInitializer(authInitializer()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        httpErrorInterceptor,
        authInterceptor,
        loaderInterceptor,
        credentialsInterceptor,
      ]),
    ),
  ],
};
