import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';
import { ButtonSecondary } from '../../shared/button-secondary/button-secondary';

@Component({
  selector: 'app-profile-edit',
  imports: [ButtonPrimary, ButtonSecondary],
  templateUrl: './profile-edit.html',
  host: {
    '(document:keydown.escape)': 'cancelled.emit()',
  },
})
export class ProfileEdit {
  readonly name = input.required<string>();
  readonly avatar = input.required<string>();
  readonly saved = output<string>();
  readonly cancelled = output<void>();

  protected readonly draft = linkedSignal(() => this.name());
  protected readonly canSave = computed(() => this.draft().trim().length > 0);

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected save(): void {
    if (this.canSave()) {
      this.saved.emit(this.draft().trim());
    }
  }
}
