import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SbbHeaderModule } from '@sbb-esta/lyne-angular/header';
import { SbbImageModule } from '@sbb-esta/lyne-angular/image';
import { SbbLoadingIndicatorModule } from '@sbb-esta/lyne-angular/loading-indicator';
import { SbbMenuModule } from '@sbb-esta/lyne-angular/menu';
import { SbbToastService } from '@sbb-esta/lyne-angular/toast';

import { AuthService } from './core/auth/auth.service';
import { ErrorDialog } from './core/http/error-dialog';
import { ERROR_NOTIFIER } from './core/http/http-error-interceptor';
import { LoaderService } from './core/loader/loader.service';

@Component({
  selector: 'journey-companion-root',
  imports: [
    RouterOutlet,
    RouterLink,
    SbbHeaderModule,
    SbbLoadingIndicatorModule,
    SbbMenuModule,
    SbbImageModule,
  ],
  template: `
    <sbb-header>
      @if (!auth.isLoggedIn()) {
        <sbb-header-link iconName="arrow-end-right-medium" routerLink="/login">
          Login
        </sbb-header-link>
      } @else {
        <sbb-header-button iconName="house-small" routerLink="/dashboard" id="dashboard">
          Dashboard
        </sbb-header-button>
        <sbb-menu trigger="dashboard">
          <sbb-menu-button (click)="logout()">Logout</sbb-menu-button>
        </sbb-menu>
      }
      <div class="sbb-header-spacer"></div>
      <sbb-image
        class="journey-companion-logo"
        imageSrc="/favicon.ico"
        alt="SBB Journey Companion logo"
        width="40"
        height="40"
      />
    </sbb-header>
    <main class="sbb-page-spacing">
      <router-outlet></router-outlet>
    </main>
    @if (loaderService.isLoading()) {
      <div class="journey-companion-loader">
        <sbb-loading-indicator size="l"></sbb-loading-indicator>
      </div>
    }
  `,
})
export class App {
  protected auth = inject(AuthService);
  protected loaderService = inject(LoaderService);
  private _router = inject(Router);
  private _sbbToastService = inject(SbbToastService);

  constructor() {
    ERROR_NOTIFIER.pipe(takeUntilDestroyed()).subscribe((message) =>
      this._sbbToastService.open(ErrorDialog, {
        data: { message },
        setupContainer: (sbbToast) => {
          sbbToast.iconName = 'circle-exclamation-point-small';
          sbbToast.timeout = 6000;
          sbbToast.position = 'top-center';
        },
      }),
    );
  }

  protected logout(): void {
    this.auth.logout();
    this._router.navigate(['/login'], { replaceUrl: true });
  }
}
