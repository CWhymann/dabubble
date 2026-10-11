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
  readonly showProfile = output<string>();

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
}
