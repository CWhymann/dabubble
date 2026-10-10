import { Component, output } from '@angular/core';
import { DayGroup } from '../../core/chat';
import { AVATARS } from '../../core/avatars';
import { ChatMessage } from '../chat-message/chat-message';

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

@Component({
  selector: 'app-chat-messages',
  imports: [ChatMessage],
  templateUrl: './chat-messages.html',
})
export class ChatMessages {
  readonly openThread = output<void>();

  protected readonly groups: DayGroup[] = [
    {
      label: 'Dienstag, 14 Januar',
      messages: [
        {
          author: 'Noah Braun',
          avatar: avatarOf('Noah Braun'),
          time: '14:25',
          text: 'Welche Version ist aktuell von Angular?',
          own: false,
          replies: { count: 2, last: '14:56' },
          reactions: [],
        },
      ],
    },
    {
      label: 'Heute',
      messages: [
        {
          author: 'Frederik Beck',
          avatar: avatarOf('Frederik Beck'),
          time: '15:06',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque blandit odio efficitur lectus vestibulum, quis accumsan ante vulputate. Quisque tristique iaculis erat, eu faucibus lacus iaculis ac.',
          own: true,
          reactions: [
            { emoji: '/icons/emoji-rocket.svg', label: 'Rakete', count: 1 },
            { emoji: '/icons/emoji-check.svg', label: 'Haken', count: 1 },
          ],
        },
      ],
    },
  ];
}
