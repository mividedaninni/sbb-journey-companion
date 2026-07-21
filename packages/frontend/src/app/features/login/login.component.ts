import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router} from '@angular/router';
import {SbbButtonModule} from '@sbb-esta/lyne-angular/button';
import {SbbLinkModule} from '@sbb-esta/lyne-angular/link';
import {SbbFormFieldModule} from '@sbb-esta/lyne-angular/form-field';
import {SbbIconModule} from '@sbb-esta/lyne-angular/icon';
import {SbbTitleModule} from '@sbb-esta/lyne-angular/title';
import {ApiError, ApiErrorCode, AuthRequestDto} from '@sbb-journey-companion/common';

import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'journey-companion-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  host: {class: 'journey-companion-routed-component'},
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbButtonModule,
    SbbLinkModule,
    SbbIconModule,
    SbbTitleModule,
  ],
})
export class LoginComponent {
  public showPassword: WritableSignal<boolean> = signal<boolean>(false);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  public loginForm: FormGroup = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  private _mode: WritableSignal<'login' | 'register'> = signal('login');
  protected readonly isLoginMode: Signal<boolean> = computed(() => this._mode() === 'login');

  get username(): AbstractControl<string> {
    return this.loginForm.controls['username'];
  }

  get password(): AbstractControl<string> {
    return this.loginForm.controls['password'];
  }

  toggleMode(): void {
    this._mode.update((current) => (current === 'login' ? 'register' : 'login'));
    this.loginForm.reset();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((currentValue) => !currentValue);
  }

  handleLogin(): void {
    const payload = this.loginForm.value as AuthRequestDto;

    const action$ = this.isLoginMode()
      ? this._authService.login(payload)
      : this._authService.register(payload);

    action$.subscribe({
      next: () => this._router.navigate(['/lobby']),
      error: (err) => this.handleError(err),
    });
  }

  handleError(err: HttpErrorResponse): void {
    const apiError = err.error as ApiError;

    switch (apiError.code) {
      case ApiErrorCode.USERNAME_TAKEN:
        this.username.setErrors({taken: true});
        this.password.reset();
        break;

      case ApiErrorCode.INVALID_CREDENTIALS:
        this.username.setErrors({invalid: true});
        this.password.setErrors({invalid: true});
        break;

      default:
        break;
    }
  }
}
