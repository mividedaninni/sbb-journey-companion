import { Component, inject } from '@angular/core';
import { SBB_OVERLAY_DATA } from '@sbb-esta/lyne-angular/core';

@Component({
  selector: 'journey-companion-error-dialog',
  template: `<p>{{ dialogData.message }}</p>`,
})
export class ErrorDialog {
  dialogData = inject<{ message: string }>(SBB_OVERLAY_DATA);
}
