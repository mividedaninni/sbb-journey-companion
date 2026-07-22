import { Component, inject } from '@angular/core';
import { SbbTitleModule } from '@sbb-esta/lyne-angular/title';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'journey-companion-dashboard',
  host: { class: 'journey-companion-routed-component' },
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [SbbTitleModule],
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
}
