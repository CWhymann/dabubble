import { Component, computed, output, signal } from '@angular/core';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';

export interface NewChannel {
  name: string;
  description: string;
}

@Component({
  selector: 'app-add-channel',
  imports: [ButtonPrimary],
  templateUrl: './add-channel.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class AddChannel {
  readonly created = output<NewChannel>();
  readonly closed = output<void>();

  protected readonly name = signal('');
  protected readonly description = signal('');

  private readonly cleanName = computed(() => this.name().trim().replace(/^#+/, '').trim());
  protected readonly canCreate = computed(() => this.cleanName().length > 0);

  protected onName(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  protected onDescription(event: Event): void {
    this.description.set((event.target as HTMLTextAreaElement).value);
  }

  protected create(): void {
    if (this.canCreate()) {
      this.created.emit({ name: this.cleanName(), description: this.description().trim() });
    }
  }
}
