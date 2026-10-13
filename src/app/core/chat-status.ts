import { Injectable, inject, signal } from '@angular/core';
import { Supabase } from './supabase';

export interface ChatStatusEntry {
  lastAt: string;
  unread: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatStatus {
  private readonly supabase = inject(Supabase);
  readonly status = signal<Record<string, ChatStatusEntry>>({});

  async refresh(): Promise<void> {
    const { data: auth } = await this.supabase.client.auth.getUser();
    const me = auth.user?.id;
    if (!me) {
      this.status.set({});
      return;
    }
    const [channelsRes, chatsRes, profilesRes, readsRes, messagesRes] = await Promise.all([
      this.supabase.client.from('channels').select('id, name'),
      this.supabase.client.from('direct_chats').select('id, user_a, user_b'),
      this.supabase.client.from('profiles').select('id, name'),
      this.supabase.client.from('chat_reads').select('chat_key, read_at').eq('user_id', me),
      this.supabase.client
        .from('messages')
        .select('author_id, channel_id, direct_chat_id, created_at')
        .order('created_at', { ascending: false })
        .limit(1000),
    ]);

    const channelName = new Map((channelsRes.data ?? []).map((c) => [c.id, c.name]));
    const profileName = new Map((profilesRes.data ?? []).map((p) => [p.id, p.name]));
    const dmName = new Map(
      (chatsRes.data ?? []).map((c) => [
        c.id,
        profileName.get(c.user_a === me ? c.user_b : c.user_a) ?? '',
      ]),
    );
    const readAt = new Map((readsRes.data ?? []).map((r) => [r.chat_key, r.read_at]));

    const lastAt = new Map<string, string>();
    const lastOther = new Map<string, string>();
    for (const message of messagesRes.data ?? []) {
      const chatKey = message.channel_id
        ? `channel:${message.channel_id}`
        : `dm:${message.direct_chat_id}`;
      if (!lastAt.has(chatKey)) {
        lastAt.set(chatKey, message.created_at);
      }
      if (message.author_id !== me && !lastOther.has(chatKey)) {
        lastOther.set(chatKey, message.created_at);
      }
    }

    const result: Record<string, ChatStatusEntry> = {};
    for (const [chatKey, time] of lastAt) {
      const sidebarKey = chatKey.startsWith('channel:')
        ? channelName.get(chatKey.slice(8))
        : `dm:${dmName.get(chatKey.slice(3)) ?? ''}`;
      if (!sidebarKey || sidebarKey === 'dm:') {
        continue;
      }
      const other = lastOther.get(chatKey);
      const read = readAt.get(chatKey);
      result[sidebarKey] = {
        lastAt: time,
        unread: other !== undefined && (!read || new Date(other) > new Date(read)),
      };
    }
    this.status.set(result);
  }

  async markRead(sidebarKey: string): Promise<void> {
    const { data: auth } = await this.supabase.client.auth.getUser();
    const me = auth.user?.id;
    if (!me) {
      return;
    }
    let chatKey: string | null = null;
    if (sidebarKey.startsWith('dm:')) {
      const otherName = sidebarKey.slice(3);
      const { data: other } = await this.supabase.client
        .from('profiles')
        .select('id')
        .eq('name', otherName)
        .maybeSingle();
      if (other) {
        const [userA, userB] = [me, other.id].sort();
        const { data: chat } = await this.supabase.client
          .from('direct_chats')
          .select('id')
          .eq('user_a', userA)
          .eq('user_b', userB)
          .maybeSingle();
        chatKey = chat ? `dm:${chat.id}` : null;
      }
    } else {
      const { data: channel } = await this.supabase.client
        .from('channels')
        .select('id')
        .eq('name', sidebarKey)
        .maybeSingle();
      chatKey = channel ? `channel:${channel.id}` : null;
    }
    if (!chatKey) {
      return;
    }
    await this.supabase.client
      .from('chat_reads')
      .upsert(
        { user_id: me, chat_key: chatKey, read_at: new Date().toISOString() },
        { onConflict: 'user_id,chat_key' },
      );
    const current = this.status();
    if (current[sidebarKey]?.unread) {
      this.status.set({ ...current, [sidebarKey]: { ...current[sidebarKey], unread: false } });
    }
  }
}
