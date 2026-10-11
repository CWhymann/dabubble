import { Component, computed, input, output, signal } from '@angular/core';
import { ChatUser, USERS } from '../../core/users';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';

@Component({
  selector: 'app-add-channel-members',
  imports: [ButtonPrimary],
  templateUrl: './add-channel-members.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class AddChannelMembers {
  readonly channelName = input.required<string>();
  readonly existingMembers = input.required<string[]>();
  readonly added = output<string[]>();
  readonly closed = output<void>();

  protected readonly query = signal('');
  protected readonly selected = signal<ChatUser[]>([]);

  protected readonly suggestions = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return [];
    }
    const taken = [...this.existingMembers(), ...this.selected().map((user) => user.name)];
    return USERS.filter(
      (user) => !taken.includes(user.name) && user.name.toLowerCase().includes(term),
    );
  });

  protected readonly canConfirm = computed(() => this.selected().length > 0);

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(user: ChatUser): void {
    this.selected.update((list) => [...list, user]);
    this.query.set('');
  }

  protected remove(user: ChatUser): void {
    this.selected.update((list) => list.filter((item) => item.name !== user.name));
  }

  protected confirm(): void {
    if (this.canConfirm()) {
      this.added.emit(this.selected().map((user) => user.name));
    }
  }
}
