import { Component, computed, input, output } from '@angular/core';
import { Message } from '../../core/chat';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.html',
})
export class ChatMessage {
  readonly message = input.required<Message>();
  readonly compact = input(false);
  readonly openThread = output<void>();

  protected readonly spacing = computed(() => {
    const own = this.message().own;
    if (this.compact()) {
      return own ? 'flex-row-reverse gap-5 px-10' : 'gap-5 px-10';
    }
    return own ? 'flex-row-reverse gap-7.5 pr-11.25 pl-36.5' : 'gap-7.5 pl-11.25';
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
}
