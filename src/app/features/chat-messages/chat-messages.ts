import { Component, computed, inject, input, output } from '@angular/core';
import { ChatStore } from '../../core/chat-store';
import { ChatMessage } from '../chat-message/chat-message';

@Component({
  selector: 'app-chat-messages',
  imports: [ChatMessage],
  templateUrl: './chat-messages.html',
})
export class ChatMessages {
  readonly channel = input.required<string>();
  readonly openThread = output<string>();
  readonly showProfile = output<string>();

  private readonly store = inject(ChatStore);

  protected readonly groups = computed(() => this.store.groupsFor(this.channel()));
}
