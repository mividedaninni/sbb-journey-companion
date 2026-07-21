import { Routes } from '@angular/router';

import { authGuard, loginAuthGuard } from './core/auth/auth-guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginAuthGuard],
    component: LoginComponent,
  },
  {
    path: 'lobby',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lobby/lobby.component').then((c) => c.LobbyComponent),
  },
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'lobby',
  },
];
