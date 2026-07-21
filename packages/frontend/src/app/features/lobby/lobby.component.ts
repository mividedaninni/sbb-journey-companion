import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {SbbButtonModule} from '@sbb-esta/lyne-angular/button';
import {SbbActionGroupModule} from '@sbb-esta/lyne-angular/action-group';
import {SbbDividerModule} from '@sbb-esta/lyne-angular/divider';
import {SbbFormFieldModule} from '@sbb-esta/lyne-angular/form-field';
import {SbbIconModule} from '@sbb-esta/lyne-angular/icon';
import {SbbTitleModule} from '@sbb-esta/lyne-angular/title';

import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'journey-companion-lobby',
  host: {class: 'journey-companion-routed-component'},
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  imports: [
    ReactiveFormsModule,
    SbbButtonModule,
    SbbActionGroupModule,
    SbbFormFieldModule,
    SbbIconModule,
    SbbTitleModule,
    SbbDividerModule,
  ],
})
export class LobbyComponent {
  public auth = inject(AuthService);

  public roomAction: WritableSignal<'create' | 'join' | 'info' | null> = signal(null);

  public name: FormControl<string | null> = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(5),
  ]);
  public code: FormControl<string | null> = new FormControl(null, [
    Validators.required,
    Validators.minLength(5),
  ]);

  updateRoomAction(value: 'create' | 'join' | 'info'): void {
    this.roomAction.update((v) => (v === value ? null : value));
  }
}
