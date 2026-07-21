import { Component, inject } from '@angular/core';
import { SbbTitleModule } from '@sbb-esta/lyne-angular/title';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'journey-companion-lobby',
  host: { class: 'journey-companion-routed-component' },
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  imports: [SbbTitleModule],
})
export class LobbyComponent {
  protected readonly auth = inject(AuthService);
}
