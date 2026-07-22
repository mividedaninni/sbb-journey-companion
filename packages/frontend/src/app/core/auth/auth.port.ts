import { InjectionToken, Signal } from '@angular/core';
import { AuthRequestDto, AuthResponseDto, UserDto } from '@sbb-journey-companion/common';
import { Observable } from 'rxjs';

export interface LoggedUser {
  user: UserDto | null;
  loggedIn: boolean;
}

export interface AuthPort {
  readonly isLoggedIn: Signal<boolean>;
  readonly currentUser: Signal<UserDto | null>;
  readonly token: string | null;

  login(req: AuthRequestDto): Observable<AuthResponseDto>;
  register(payload: AuthRequestDto): Observable<AuthResponseDto>;
  refresh(): Observable<AuthResponseDto | null>;
  logout(): void;
}

export const AUTH_PORT = new InjectionToken<AuthPort>('AuthPort');
