import { Component, computed, input, output, signal } from '@angular/core';
import { ChatUser, USERS } from '../../core/users';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';

type MemberMode = 'all' | 'specific';

@Component({
  selector: 'app-add-members',
  imports: [ButtonPrimary],
  templateUrl: './add-members.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class AddMembers {
  readonly channelName = input.required<string>();
  readonly confirmed = output<string[]>();
  readonly closed = output<void>();

  protected readonly mode = signal<MemberMode>('all');
  protected readonly query = signal('');
  protected readonly selected = signal<ChatUser[]>([]);

  protected readonly suggestions = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return [];
    }
    const taken = this.selected().map((user) => user.name);
    return USERS.filter(
      (user) => !taken.includes(user.name) && user.name.toLowerCase().includes(term),
    );
  });

  protected readonly canConfirm = computed(
    () => this.mode() === 'all' || this.selected().length > 0,
  );

  protected setMode(mode: MemberMode): void {
    this.mode.set(mode);
  }

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
    if (!this.canConfirm()) {
      return;
    }
    const members = this.mode() === 'all' ? USERS : this.selected();
    this.confirmed.emit(members.map((user) => user.name));
  }
}
