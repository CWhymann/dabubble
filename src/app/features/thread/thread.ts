import { Component, computed, inject, input, output } from '@angular/core';
import { ChatStore } from '../../core/chat-store';
import { ChatMessage } from '../chat-message/chat-message';

@Component({
  selector: 'app-thread',
  imports: [ChatMessage],
  templateUrl: './thread.html',
})
export class Thread {
  readonly rootId = input<string | null>(null);
  readonly showProfile = output<string>();

  private readonly store = inject(ChatStore);

  protected readonly root = computed(() => {
    const id = this.rootId();
    return id ? this.store.findMessage(id) : undefined;
  });

  protected readonly replies = computed(() => {
    const id = this.rootId();
    return id ? this.store.repliesOf(id) : [];
  });
}
