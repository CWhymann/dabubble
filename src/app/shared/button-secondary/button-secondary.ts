import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-button-secondary',
  templateUrl: './button-secondary.html',
})
export class ButtonSecondary {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly compact = input(false);

  protected readonly padding = computed(() => (this.compact() ? 'px-4.5 py-1.75' : 'px-6.25 py-3'));
}
