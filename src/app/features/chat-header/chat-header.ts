import { Component, computed, input } from '@angular/core';
import { AVATARS } from '../../core/avatars';

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.html',
})
export class ChatHeader {
  readonly channelName = input.required<string>();
  readonly members = input.required<string[]>();

  protected readonly avatars = computed(() => this.members().slice(0, 3).map(avatarOf));
}
