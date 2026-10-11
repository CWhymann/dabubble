import { Component, input, output } from '@angular/core';
import { ButtonPrimary } from '../button-primary/button-primary';
import { ButtonSecondary } from '../button-secondary/button-secondary';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ButtonPrimary, ButtonSecondary],
  templateUrl: './confirm-dialog.html',
  host: {
    '(document:keydown.escape)': 'cancelled.emit()',
  },
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Bestätigen');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
