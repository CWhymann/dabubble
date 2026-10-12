import { Component, computed, input, output, signal } from '@angular/core';
import { ChatUser, DM_USERS, isOwnUser } from '../../core/users';

export interface ChannelEdit {
  name: string;
  description: string;
}

@Component({
  selector: 'app-channel-edition',
  templateUrl: './channel-edition.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class ChannelEdition {
  readonly channel = input.required<string>();
  readonly description = input.required<string>();
  readonly creator = input.required<string>();
  readonly memberNames = input.required<string[]>();
  readonly takenNames = input<string[]>([]);
  readonly saved = output<ChannelEdit>();
  readonly closed = output<void>();
  readonly showProfile = output<string>();
  readonly addMembers = output<void>();
  readonly leave = output<void>();
  readonly isAdmin = input(false);
  readonly removeMembers = output<string[]>();

  protected readonly selected = signal<string[]>([]);

  protected selectable(user: ChatUser): boolean {
    return this.isAdmin() && !isOwnUser(user);
  }

  protected isSelected(user: ChatUser): boolean {
    return this.selected().includes(user.name);
  }

  protected toggleSelect(user: ChatUser): void {
    this.selected.update((list) =>
      list.includes(user.name) ? list.filter((name) => name !== user.name) : [...list, user.name],
    );
  }

  protected removeSelected(): void {
    const names = this.selected();
    if (names.length === 0) {
      return;
    }
    this.selected.set([]);
    this.removeMembers.emit(names);
  }

  protected readonly editingName = signal(false);
  protected readonly editingDescription = signal(false);
  protected readonly nameDraft = signal('');
  protected readonly descriptionDraft = signal('');

  protected readonly members = computed(() =>
    this.memberNames()
      .map((name) => DM_USERS.find((user) => user.name === name))
      .filter((user): user is ChatUser => user !== undefined),
  );

  protected readonly nameError = computed(() => {
    const name = this.nameDraft().trim();
    if (!name) {
      return 'Bitte gib einen Namen ein.';
    }
    const taken = this.takenNames().some(
      (other) => other !== this.channel() && other.toLowerCase() === name.toLowerCase(),
    );
    return taken ? 'Diesen Channel-Namen gibt es schon.' : '';
  });

  protected label(user: ChatUser): string {
    return isOwnUser(user) ? `${user.name} (Du)` : user.name;
  }

  protected toggleName(): void {
    if (this.editingName()) {
      if (this.nameError()) {
        return;
      }
      const name = this.nameDraft().trim();
      this.editingName.set(false);
      if (name !== this.channel()) {
        this.saved.emit({ name, description: this.description() });
      }
      return;
    }
    this.nameDraft.set(this.channel());
    this.editingName.set(true);
  }

  protected toggleDescription(): void {
    if (this.editingDescription()) {
      const description = this.descriptionDraft().trim();
      this.editingDescription.set(false);
      if (description !== this.description()) {
        this.saved.emit({ name: this.channel(), description });
      }
      return;
    }
    this.descriptionDraft.set(this.description());
    this.editingDescription.set(true);
  }

  protected onNameInput(event: Event): void {
    this.nameDraft.set((event.target as HTMLInputElement).value);
  }

  protected onDescriptionInput(event: Event): void {
    this.descriptionDraft.set((event.target as HTMLTextAreaElement).value);
  }
}
