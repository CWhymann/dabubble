import { Injectable, signal } from '@angular/core';
import { AVATARS } from './avatars';
import { DEV_CHANNEL } from './channels';
import { DayGroup, Message, Reaction } from './chat';
import { ReactionOption } from './reactions';

const avatarOf = (name: string) => AVATARS.find((avatar) => avatar.name === name)?.src ?? '';
const OWN_AVATAR = '/icons/avatar-frederik-beck.svg';

const timeNow = () =>
  new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

const DEV_SEED: DayGroup[] = [
  {
    label: 'Dienstag, 14 Januar',
    messages: [
      {
        id: 'noah-root',
        author: 'Noah Braun',
        avatar: avatarOf('Noah Braun'),
        time: '14:25',
        text: 'Welche Version ist aktuell von Angular?',
        own: false,
        replies: { count: 2, last: '15:06' },
        reactions: [],
      },
    ],
  },
  {
    label: 'Heute',
    messages: [
      {
        id: 'frederik-lorem',
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

const THREAD_SEED: Record<string, Message[]> = {
  'noah-root': [
    {
      id: 'sofia-reply',
      author: 'Sofia Müller',
      avatar: avatarOf('Sofia Müller'),
      time: '14:30',
      text: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
      own: false,
      reactions: [{ emoji: '/icons/emoji-nerd.svg', label: 'Nerd', count: 1 }],
    },
    {
      id: 'frederik-reply',
      author: 'Frederik Beck',
      avatar: avatarOf('Frederik Beck'),
      time: '15:06',
      text: 'Ja das ist es.',
      own: true,
      reactions: [{ emoji: '/icons/emoji-hands-up.svg', label: 'Hände hoch', count: 1 }],
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class ChatStore {
  private readonly chats = signal<Record<string, DayGroup[]>>({ [DEV_CHANNEL]: DEV_SEED });
  private readonly threads = signal<Record<string, Message[]>>(THREAD_SEED);

  groupsFor(key: string): DayGroup[] {
    return this.chats()[key] ?? [];
  }

  repliesOf(rootId: string): Message[] {
    return this.threads()[rootId] ?? [];
  }

  findMessage(id: string): Message | undefined {
    for (const groups of Object.values(this.chats())) {
      for (const group of groups) {
        const found = group.messages.find((message) => message.id === id);
        if (found) {
          return found;
        }
      }
    }
    for (const list of Object.values(this.threads())) {
      const found = list.find((message) => message.id === id);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  send(key: string, text: string, author: string): void {
    const message = this.createMessage(text, author);
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

  reply(rootId: string, text: string, author: string): void {
    const message = this.createMessage(text, author);
    this.threads.update((map) => ({ ...map, [rootId]: [...(map[rootId] ?? []), message] }));
    this.mapMessage(rootId, (root) => ({
      ...root,
      replies: { count: (root.replies?.count ?? 0) + 1, last: message.time },
    }));
  }

  editMessage(id: string, text: string): void {
    this.mapMessage(id, (message) => ({ ...message, text }));
  }

  toggleReaction(messageId: string, option: ReactionOption): void {
    this.mapMessage(messageId, (message) => {
      const existing = message.reactions.find((reaction) => reaction.emoji === option.icon);
      if (!existing) {
        return {
          ...message,
          reactions: [
            ...message.reactions,
            { emoji: option.icon, label: option.label, count: 1, mine: true },
          ],
        };
      }
      const mine = existing.mine === true;
      const count = existing.count + (mine ? -1 : 1);
      const reactions: Reaction[] =
        count > 0
          ? message.reactions.map((reaction) =>
              reaction.emoji === option.icon ? { ...reaction, count, mine: !mine } : reaction,
            )
          : message.reactions.filter((reaction) => reaction.emoji !== option.icon);
      return { ...message, reactions };
    });
  }

  notify(key: string, text: string): void {
    const message: Message = {
      id: crypto.randomUUID(),
      author: '',
      avatar: '',
      time: timeNow(),
      text,
      own: false,
      reactions: [],
      system: true,
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

  private createMessage(text: string, author: string): Message {
    return {
      id: crypto.randomUUID(),
      author,
      avatar: avatarOf(author) || OWN_AVATAR,
      time: timeNow(),
      text,
      own: true,
      reactions: [],
    };
  }

  private mapMessage(id: string, change: (message: Message) => Message): void {
    const apply = (list: Message[]) =>
      list.map((message) => (message.id === id ? change(message) : message));
    this.chats.update((map) =>
      Object.fromEntries(
        Object.entries(map).map(([key, groups]) => [
          key,
          groups.map((group) => ({ ...group, messages: apply(group.messages) })),
        ]),
      ),
    );
    this.threads.update((map) =>
      Object.fromEntries(Object.entries(map).map(([root, list]) => [root, apply(list)])),
    );
  }
}
