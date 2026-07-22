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
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
