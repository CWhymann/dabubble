import { Injectable, computed, inject, signal } from '@angular/core';
import { ChatStatus } from './chat-status';
import { DEV_CHANNEL } from './channels';
import { ChatStore } from './chat-store';
import { Data } from './data';
import { ChatUser, setUsers } from './users';

export interface ChannelMeta {
  description: string;
  creator: string;
}

@Injectable({ providedIn: 'root' })
export class ChatState {
  private readonly store = inject(ChatStore);
  private readonly data = inject(Data);
  private readonly chatStatus = inject(ChatStatus);
  private stopWatching: (() => void) | null = null;

  readonly channels = signal<string[]>([]);
  readonly channelMembers = signal<Record<string, string[]>>({});
  readonly channelMeta = signal<Record<string, ChannelMeta>>({});
  readonly memberAvatars = signal<Record<string, string>>({});
  readonly activeChannel = signal<string | null>(null);
  readonly activeDm = signal<ChatUser | null>(null);
  readonly threadRootId = signal<string | null>(null);

  readonly activeMembers = computed(() => {
    const channel = this.activeChannel();
    return channel ? (this.channelMembers()[channel] ?? []) : [];
  });

  readonly activeChannelMeta = computed<ChannelMeta>(() => {
    const channel = this.activeChannel();
    return (channel && this.channelMeta()[channel]) || { description: '', creator: '' };
  });

  readonly activeChatKey = computed(() => {
    const dm = this.activeDm();
    return dm ? `dm:${dm.name}` : this.activeChannel();
  });

  start(): void {
    if (this.stopWatching) {
      return;
    }
    this.stopWatching = this.data.watchChanges(() => {
      void this.loadMessages();
      void this.loadReplies();
    });
  }

  stop(): void {
    this.stopWatching?.();
    this.stopWatching = null;
  }

  async loadChannels(): Promise<void> {
    const records = await this.data.loadChannels();
    this.channels.set(records.map((record) => record.name));
    this.channelMembers.set(
      Object.fromEntries(records.map((record) => [record.name, record.members])),
    );
    this.channelMeta.set(
      Object.fromEntries(
        records.map((record) => [
          record.name,
          { description: record.description, creator: record.createdBy },
        ]),
      ),
    );
    const avatars = await this.data.loadAvatars();
    setUsers(avatars);
    this.memberAvatars.set(avatars);
    const first = records.find((record) => record.name === DEV_CHANNEL) ?? records[0];
    this.activeChannel.set(first?.name ?? null);
    await this.loadMessages();
  }

  async loadMessages(): Promise<void> {
    const key = this.activeChatKey();
    if (key) {
      this.store.setMessages(key, await this.data.loadMessages(key));
      await this.chatStatus.markRead(key);
    }
    await this.chatStatus.refresh();
  }

  async loadReplies(): Promise<void> {
    const rootId = this.threadRootId();
    if (rootId) {
      this.store.setReplies(rootId, await this.data.loadReplies(rootId));
    }
  }

  async sendMessage(text: string): Promise<void> {
    const key = this.activeChatKey();
    if (key) {
      await this.data.sendMessage(key, text);
      await this.loadMessages();
    }
  }

  async sendReply(text: string): Promise<void> {
    const rootId = this.threadRootId();
    if (rootId) {
      await this.data.sendReply(rootId, text);
      await this.loadReplies();
      await this.loadMessages();
    }
  }
}
