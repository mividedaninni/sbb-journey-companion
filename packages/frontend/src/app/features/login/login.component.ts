import { HttpErrorResponse } from '@angular/common/http';
import { Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  minLength,
  ValidationError,
  FormRoot,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { SbbButtonModule } from '@sbb-esta/lyne-angular/button';
import { SbbFormFieldModule } from '@sbb-esta/lyne-angular/form-field';
import { SbbIconModule } from '@sbb-esta/lyne-angular/icon';
import { SbbLinkModule } from '@sbb-esta/lyne-angular/link';
import { SbbTitleModule } from '@sbb-esta/lyne-angular/title';
import { ApiError, ApiErrorCode, AuthRequestDto } from '@sbb-journey-companion/common';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'journey-companion-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  host: { class: 'journey-companion-routed-component' },
  imports: [
    FormField,
    SbbFormFieldModule,
    SbbButtonModule,
    SbbLinkModule,
    SbbIconModule,
    SbbTitleModule,
    FormRoot,
  ],
})
export class LoginComponent {
  protected readonly showPassword: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isLoginMode: Signal<boolean> = computed(() => this._mode() === 'login');
  protected loginModel: WritableSignal<AuthRequestDto> = signal<AuthRequestDto>({
    username: '',
    password: '',
  });

  private _authService = inject(AuthService);
  private _router = inject(Router);

  private _mode: WritableSignal<'login' | 'register'> = signal('login');

  protected readonly loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.username, { message: 'Username is required.' });
      minLength(schemaPath.username, 3, {
        message: 'Username must be at least 3 characters.',
      });
      required(schemaPath.password, { message: 'Password is required.' });
      minLength(schemaPath.password, 6, {
        message: 'Password must be at least 6 characters.',
      });
    },
    {
      submission: {
        action: async (field) => {
          const payload = field().value();

          const action$ = this.isLoginMode()
            ? this._authService.login(payload)
            : this._authService.register(payload);

          try {
            await firstValueFrom(action$);
            this._router.navigate(['/dashboard']);
            return undefined;
          } catch (err) {
            return this.mapServerErrors(err as HttpErrorResponse);
          }
        },
      },
    },
  );

  protected toggleMode(): void {
    this._mode.update((current) => (current === 'login' ? 'register' : 'login'));
    this.loginModel.set({ username: '', password: '' });
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((currentValue) => !currentValue);
  }

  private mapServerErrors(
    err: HttpErrorResponse,
  ): ValidationError.WithOptionalFieldTree[] | undefined {
    const apiError = err.error as ApiError;

    switch (apiError.code) {
      case ApiErrorCode.USERNAME_TAKEN:
        return [
          {
            fieldTree: this.loginForm.username,
            kind: 'taken',
            message: 'Registration failed. Please try a different username.',
          },
        ];

      case ApiErrorCode.INVALID_CREDENTIALS:
        return [
          {
            fieldTree: this.loginForm.username,
            kind: 'invalid',
            message: 'Invalid username or password.',
          },
          {
            fieldTree: this.loginForm.password,
            kind: 'invalid',
            message: 'Invalid username or password.',
          },
        ];

      default:
        return undefined;
    }
  }
}
