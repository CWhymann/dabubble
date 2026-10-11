import { Injectable, signal } from '@angular/core';
import { AVATARS } from './avatars';
import { DEV_CHANNEL } from './channels';
import { DayGroup, Message } from './chat';

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';

const DEV_SEED: DayGroup[] = [
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

// Speichert alle Nachrichten nach Chat-Schlüssel. Neue Nachrichten landen in "Heute".
@Injectable({ providedIn: 'root' })
export class ChatStore {
  private readonly chats = signal<Record<string, DayGroup[]>>({ [DEV_CHANNEL]: DEV_SEED });

  groupsFor(key: string): DayGroup[] {
    return this.chats()[key] ?? [];
  }

  send(key: string, text: string, author: string): void {
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const message: Message = {
      author,
      avatar: avatarOf(author) || '/icons/avatar-frederik-beck.svg',
      time,
      text,
      own: true,
      reactions: [],
    };
    this.chats.update((map) => {
      const groups = map[key] ?? [];
      const last = groups[groups.length - 1];
      const next =
        last?.label === 'Heute'
          ? [...groups.slice(0, -1), { ...last, messages: [...last.messages, message] }]
          : [...groups, { label: 'Heute', messages: [message] }];
      return { ...map, [key]: next };
    });
  }
}
