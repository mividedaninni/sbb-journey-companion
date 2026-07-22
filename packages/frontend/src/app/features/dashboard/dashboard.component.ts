import { Component, inject } from '@angular/core';
import { SbbTitleModule } from '@sbb-esta/lyne-angular/title';

import { AUTH_PORT } from '../../core/auth/auth.port';

@Component({
  selector: 'journey-companion-dashboard',
  host: { class: 'journey-companion-routed-component' },
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [SbbTitleModule],
})
export class DashboardComponent {
  protected readonly auth = inject(AUTH_PORT);
}
