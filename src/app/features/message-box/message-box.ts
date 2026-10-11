import { Component, computed, input, output, signal } from '@angular/core';
import { ChatUser, DM_USERS, isOwnUser } from '../../core/users';

const EMOJIS = [
  '😀',
  '😂',
  '😍',
  '😎',
  '😅',
  '🤔',
  '😢',
  '😊',
  '👍',
  '👏',
  '🙌',
  '🙏',
  '💪',
  '🤝',
  '👀',
  '🔥',
  '🎉',
  '🥳',
  '🚀',
  '✅',
  '⭐',
  '💡',
  '❤️',
  '🤓',
];

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.html',
})
export class MessageBox {
  readonly placeholder = input('Nachricht an #Entwicklerteam');
  readonly sent = output<string>();

  protected readonly emojis = EMOJIS;
  protected readonly text = signal('');
  protected readonly emojiOpen = signal(false);

  // Trifft zu, wenn das Feld mit "@" plus optionalem Suchbegriff endet.
  private readonly tagMatch = computed(() => this.text().match(/(?:^|\s)@([^\s@]*)$/));
  protected readonly tagging = computed(() => this.tagMatch() !== null);
  protected readonly tagHits = computed<ChatUser[]>(() => {
    const match = this.tagMatch();
    if (!match) {
      return [];
    }
    const term = match[1].toLowerCase();
    return DM_USERS.filter((user) => user.name.toLowerCase().includes(term));
  });

  protected label(user: ChatUser): string {
    return isOwnUser(user) ? `${user.name} (Du)` : user.name;
  }

  protected onInput(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value);
  }

  // Enter sendet, Shift+Enter fügt eine neue Zeile ein.
  protected onEnter(event: Event): void {
    if ((event as KeyboardEvent).shiftKey) {
      return;
    }
    event.preventDefault();
    this.submit();
  }

  protected submit(): void {
    const value = this.text().trim();
    if (!value) {
      return;
    }
    this.sent.emit(value);
    this.text.set('');
    this.emojiOpen.set(false);
  }

  protected startTag(): void {
    this.emojiOpen.set(false);
    this.text.update((value) => {
      if (value === '' || /\s$/.test(value)) {
        return value + '@';
      }
      return value + ' @';
    });
  }

  protected tag(user: ChatUser): void {
    this.text.update((value) => value.replace(/@([^\s@]*)$/, `@${user.name} `));
  }

  protected toggleEmojis(event: Event): void {
    event.stopPropagation();
    this.emojiOpen.update((open) => !open);
  }

  protected insertEmoji(emoji: string): void {
    this.text.update((value) => value + emoji);
    this.emojiOpen.set(false);
  }
}
