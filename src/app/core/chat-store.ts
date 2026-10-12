import { Injectable, inject, signal } from '@angular/core';
import { AVATARS } from './avatars';
import { DEV_CHANNEL } from './channels';
import { DayGroup, Message, Reaction } from './chat';
import { ReactionOption } from './reactions';
import { Data, MessageRecord, ReplyRecord } from './data';
import { OWN_USER } from './users';

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

@Injectable({ providedIn: 'root' })
export class ChatStore {
  private readonly data = inject(Data);
  private readonly chats = signal<Record<string, DayGroup[]>>({ [DEV_CHANNEL]: DEV_SEED });
  private readonly threads = signal<Record<string, Message[]>>({});

  groupsFor(key: string): DayGroup[] {
    return (this.chats()[key] ?? []).map((group) => ({
      ...group,
      messages: group.messages.map((message) => this.withOwnAuthor(message)),
    }));
  }

  repliesOf(rootId: string): Message[] {
    return (this.threads()[rootId] ?? []).map((message) => this.withOwnAuthor(message));
  }

  private withOwnAuthor(message: Message): Message {
    return message.own && OWN_USER.name !== '' ? { ...message, author: OWN_USER.name } : message;
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

  editMessage(id: string, text: string): void {
    void this.data.editMessage(id, text);
    this.mapMessage(id, (message) => ({ ...message, text }));
  }

  toggleReaction(messageId: string, option: ReactionOption): void {
    const wasMine =
      this.findMessage(messageId)?.reactions.find((reaction) => reaction.emoji === option.icon)
        ?.mine === true;
    void this.data.toggleReaction(messageId, option.icon, wasMine);
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

  delete(id: string): void {
    void this.data.deleteMessage(id);
    const rootId = Object.keys(this.threads()).find((root) =>
      this.threads()[root].some((message) => message.id === id),
    );
    this.chats.update((map) =>
      Object.fromEntries(
        Object.entries(map).map(([key, groups]) => [
          key,
          groups
            .map((group) => ({
              ...group,
              messages: group.messages.filter((message) => message.id !== id),
            }))
            .filter((group) => group.messages.length > 0),
        ]),
      ),
    );
    this.threads.update((map) =>
      Object.fromEntries(
        Object.entries(map).map(([root, list]) => [
          root,
          list.filter((message) => message.id !== id),
        ]),
      ),
    );
    if (rootId) {
      this.mapMessage(rootId, (root) => {
        const count = (root.replies?.count ?? 0) - 1;
        return {
          ...root,
          replies: count > 0 && root.replies ? { ...root.replies, count } : undefined,
        };
      });
    }
  }

  setMessages(key: string, records: MessageRecord[]): void {
    const systemMessages = (this.chats()[key] ?? []).flatMap((group) =>
      group.messages.filter((message) => message.system),
    );
    const groups: DayGroup[] = [];
    for (const record of records) {
      const message: Message = {
        id: record.id,
        author: record.author,
        avatar: record.avatar,
        time: record.time,
        text: record.text,
        own: record.own,
        reactions: record.reactions,
        replies:
          record.replyCount > 0 ? { count: record.replyCount, last: record.lastReply } : undefined,
      };
      const last = groups[groups.length - 1];
      if (last?.label === record.dayLabel) {
        last.messages.push(message);
      } else {
        groups.push({ label: record.dayLabel, messages: [message] });
      }
    }
    if (systemMessages.length > 0) {
      const last = groups[groups.length - 1];
      if (last) {
        last.messages.push(...systemMessages);
      } else {
        groups.push({ label: 'Heute', messages: systemMessages });
      }
    }
    this.chats.update((map) => ({ ...map, [key]: groups }));
  }

  setReplies(rootId: string, records: ReplyRecord[]): void {
    const replies: Message[] = records.map((record) => ({
      id: record.id,
      author: record.author,
      avatar: record.avatar,
      time: record.time,
      text: record.text,
      own: record.own,
      reactions: record.reactions,
    }));
    this.threads.update((map) => ({ ...map, [rootId]: replies }));
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
