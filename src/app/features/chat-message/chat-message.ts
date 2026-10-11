import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Message, Reaction } from '../../core/chat';
import { ChatStore } from '../../core/chat-store';
import { REACTION_OPTIONS, ReactionOption } from '../../core/reactions';

const WIDE_QUERY = '(min-width: 1024px)';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.html',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ChatMessage {
  readonly message = input.required<Message>();
  readonly compact = input(false);
  readonly canReply = input(true);
  readonly openThread = output<string>();
  readonly showProfile = output<string>();

  protected readonly reactionOptions = REACTION_OPTIONS;
  protected readonly quickReactions = REACTION_OPTIONS.filter(
    (option) =>
      option.icon === '/icons/emoji-check.svg' || option.icon === '/icons/emoji-hands-up.svg',
  );

  protected readonly pickerOpen = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  // Auf dem Handy gibt es keinen Hover: Ein Tipp auf die Nachricht zeigt die Leiste.
  protected readonly tapped = signal(false);
  protected readonly expanded = signal(false);

  private readonly store = inject(ChatStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly wide = signal(false);

  constructor() {
    if (typeof matchMedia === 'undefined') {
      return;
    }
    const query = matchMedia(WIDE_QUERY);
    this.wide.set(query.matches);
    const listener = (event: MediaQueryListEvent) => this.wide.set(event.matches);
    query.addEventListener('change', listener);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', listener));
  }

  // Die Leiste bleibt sichtbar, solange ein Menü offen ist oder die Nachricht angetippt wurde.
  protected readonly barVisible = computed(
    () => this.tapped() || this.pickerOpen() || this.menuOpen(),
  );

  // Thread und Mobil: 7 Reaktionen, Desktop: 20.
  protected readonly limit = computed(() => (this.compact() || !this.wide() ? 7 : 20));

  protected readonly visibleReactions = computed<Reaction[]>(() => {
    const all = this.message().reactions;
    return this.expanded() ? all : all.slice(0, this.limit());
  });

  protected readonly hiddenCount = computed(() =>
    this.expanded() ? 0 : Math.max(0, this.message().reactions.length - this.limit()),
  );

  protected readonly spacing = computed(() => {
    const own = this.message().own;
    if (this.compact()) {
      return own
        ? 'flex-row-reverse gap-4 pr-4 pl-12.5 thread:gap-5 thread:px-10'
        : 'gap-4 pr-12.5 pl-4 thread:gap-5 thread:px-10';
    }
    return own
      ? 'flex-row-reverse gap-4 pr-4 pl-12.5 lg:gap-7.5 lg:pr-11.25 lg:pl-36.5'
      : 'gap-5 px-4 lg:gap-7.5 lg:pr-0 lg:pl-11.25';
  });

  protected readonly bubble = computed(() => {
    const own = this.message().own;
    if (this.compact()) {
      return own
        ? 'rounded-tl-[20px] rounded-br-[20px] rounded-bl-[20px] bg-purple-2 text-white'
        : 'rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] bg-bg group-hover:bg-white';
    }
    return own
      ? 'rounded-tl-[30px] rounded-br-[30px] rounded-bl-[30px] bg-purple-2 text-white'
      : 'rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] bg-bg group-hover:bg-white';
  });

  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.pickerOpen.set(false);
      this.menuOpen.set(false);
      this.tapped.set(false);
    }
  }

  // Escape bricht eine laufende Bearbeitung ab, sonst schließt es Menüs.
  protected onEscape(): void {
    if (this.editing()) {
      this.cancelEdit();
      return;
    }
    this.pickerOpen.set(false);
    this.menuOpen.set(false);
    this.tapped.set(false);
  }

  protected togglePicker(): void {
    this.menuOpen.set(false);
    this.pickerOpen.update((open) => !open);
  }

  protected toggleMenu(): void {
    this.pickerOpen.set(false);
    this.menuOpen.update((open) => !open);
  }

  protected startEdit(): void {
    this.menuOpen.set(false);
    this.pickerOpen.set(false);
    this.tapped.set(false);
    this.draft.set(this.message().text);
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  protected saveEdit(): void {
    const text = this.draft().trim();
    if (text) {
      this.store.editMessage(this.message().id, text);
    }
    this.editing.set(false);
  }

  protected onDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected toggle(option: ReactionOption): void {
    this.store.toggleReaction(this.message().id, option);
    this.pickerOpen.set(false);
  }

  protected toggleChip(reaction: Reaction): void {
    this.toggle({ icon: reaction.emoji, label: reaction.label });
  }
}
