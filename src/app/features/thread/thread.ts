import { Component } from '@angular/core';
import { AVATARS } from '../../core/avatars';
import { Message } from '../../core/chat';
import { ChatMessage } from '../chat-message/chat-message';

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

@Component({
  selector: 'app-thread',
  imports: [ChatMessage],
  templateUrl: './thread.html',
})
export class Thread {
  protected readonly root: Message = {
    author: 'Noah Braun',
    avatar: avatarOf('Noah Braun'),
    time: '14:25',
    text: 'Welche Version ist aktuell von Angular?',
    own: false,
    reactions: [],
  };

  protected readonly replies: Message[] = [
    {
      author: 'Sofia Müller',
      avatar: avatarOf('Sofia Müller'),
      time: '14:30',
      text: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
      own: false,
      reactions: [{ emoji: '/icons/emoji-nerd.svg', label: 'Nerd', count: 1 }],
    },
    {
      author: 'Frederik Beck',
      avatar: avatarOf('Frederik Beck'),
      time: '15:06',
      text: 'Ja das ist es.',
      own: true,
      reactions: [{ emoji: '/icons/emoji-hands-up.svg', label: 'Hände hoch', count: 1 }],
    },
  ];
}
