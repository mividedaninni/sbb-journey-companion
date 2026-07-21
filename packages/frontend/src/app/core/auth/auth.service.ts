import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { AuthRequestDto, AuthResponseDto, JwtPayloadDto } from '@sbb-journey-companion/common';
import { BehaviorSubject, catchError, filter, Observable, take, tap, throwError } from 'rxjs';

import { activeSessionKey, activeSessionValue } from '../../app.config';

interface LoggedUser {
  user: JwtPayloadDto | null;
  loggedIn: boolean;
}

@Service()
export class AuthService {
  #http: HttpClient = inject(HttpClient);
  #accessToken: string | null = null;
  #refreshInProgress = false;
  #refreshSubject = new BehaviorSubject<AuthResponseDto | null>(null);

  readonly #authState = signal<LoggedUser>({ loggedIn: false, user: null });
  readonly authState = this.#authState.asReadonly();
  readonly isLoggedIn = computed(() => this.authState().loggedIn);
  readonly currentUser = computed(() => this.authState().user);

  get token() {
    return this.#accessToken;
  }

  login(req: AuthRequestDto): Observable<AuthResponseDto> {
    return this.#http
      .post<AuthResponseDto>('/api/login', req)
      .pipe(tap((res) => this._setSession(res)));
  }

  register(payload: AuthRequestDto): Observable<AuthResponseDto> {
    return this.#http
      .post<AuthResponseDto>('/api/register', payload)
      .pipe(tap((res) => this._setSession(res)));
  }

  refresh(): Observable<AuthResponseDto | null> {
    if (this.#refreshInProgress) {
      return this.#refreshSubject.pipe(
        filter((res) => res !== null),
        take(1),
      );
    }

    this.#refreshInProgress = true;
    this.#refreshSubject.next(null);

    return this.#http.post<AuthResponseDto>('/api/refresh', {}).pipe(
      tap((res: AuthResponseDto) => {
        this._setSession(res);
        this.#refreshInProgress = false;
        this.#refreshSubject.next(res);
      }),
      catchError((error) => {
        this.#refreshInProgress = false;
        this.#refreshSubject.next(null);
        return throwError(() => error);
      }),
    );
  }

  logout() {
    this._clearSession();
    this.#http.post('/api/logout', {}).subscribe();
  }

  private _setSession(res: AuthResponseDto): void {
    this.#accessToken = res.accessToken;
    this.#authState.set({
      loggedIn: true,
      user: res.user,
    });
    sessionStorage.setItem(activeSessionKey, activeSessionValue);
  }

  private _clearSession(): void {
    this.#accessToken = null;
    this.#refreshInProgress = false;
    this.#refreshSubject.next(null);
    this.#authState.set({
      loggedIn: false,
      user: null,
    });
    sessionStorage.removeItem(activeSessionKey);
  }
}
