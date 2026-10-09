import { Component } from '@angular/core';
import { AVATARS } from '../../core/avatars';

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.html',
})
export class ChatHeader {
  protected readonly channelName = 'Entwicklerteam';
  protected readonly members = ['Noah Braun', 'Sofia Müller', 'Frederik Beck'].map(avatarOf);
}
