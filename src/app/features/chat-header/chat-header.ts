import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.html',
})
export class ChatHeader {
  readonly channelName = input.required<string>();
  readonly members = input.required<string[]>();
  readonly memberAvatars = input<Record<string, string>>({});
  readonly editChannel = output<void>();
  readonly addMembers = output<void>();
  readonly showMembers = output<void>();

  protected readonly avatars = computed(() =>
    this.members()
      .slice(0, 3)
      .map((name) => this.memberAvatars()[name] ?? '/icons/avatar-frederik-beck.svg'),
  );
}
