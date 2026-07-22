import { computed, Service, signal } from '@angular/core';
import { AuthRequestDto, AuthResponseDto, UserDto } from '@sbb-journey-companion/common';
import { delay, Observable, of } from 'rxjs';

import { AuthPort, LoggedUser } from './auth.port';

const LOCAL_USER_KEY = 'sjc-local-user';
const LOCAL_TOKEN = 'local-mode-no-token';

@Service()
export class AuthService implements AuthPort {
  readonly #authState = signal<LoggedUser>(this.#restore());
  readonly isLoggedIn = computed(() => this.#authState().loggedIn);
  readonly currentUser = computed(() => this.#authState().user);

  get token() {
    return this.isLoggedIn() ? LOCAL_TOKEN : null;
  }

  login(req: AuthRequestDto): Observable<AuthResponseDto> {
    return this.#createLocalSession(req.username);
  }

  register(payload: AuthRequestDto): Observable<AuthResponseDto> {
    return this.#createLocalSession(payload.username);
  }

  refresh(): Observable<AuthResponseDto | null> {
    const user = this.currentUser();
    if (!user) {
      return of(null);
    }
    return of({ accessToken: LOCAL_TOKEN, user }).pipe(delay(150));
  }

  logout(): void {
    localStorage.removeItem(LOCAL_USER_KEY);
    this.#authState.set({ loggedIn: false, user: null });
  }

  #createLocalSession(username: string): Observable<AuthResponseDto> {
    const user: UserDto = { id: crypto.randomUUID(), username, isAdmin: false };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    this.#authState.set({ loggedIn: true, user });
    return of({ accessToken: LOCAL_TOKEN, user }).pipe(delay(150));
  }

  #restore(): LoggedUser {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    if (!raw) {
      return { loggedIn: false, user: null };
    }
    return { loggedIn: true, user: JSON.parse(raw) as UserDto };
  }
}
