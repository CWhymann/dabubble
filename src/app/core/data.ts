import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';

export interface MessageRecord {
  id: string;
  text: string;
  author: string;
  avatar: string;
  time: string;
  dayLabel: string;
  own: boolean;
}

function dayLabel(date: Date): string {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday
    ? 'Heute'
    : date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

export interface ChannelRecord {
  name: string;
  description: string;
  createdBy: string;
  members: string[];
}

@Injectable({ providedIn: 'root' })
export class Data {
  private readonly supabase = inject(Supabase);

  async createChannel(name: string, description: string): Promise<void> {
    const userId = await this.currentUserId();
    if (!userId) {
      return;
    }
    const { data: channel } = await this.supabase.client
      .from('channels')
      .insert({ name, description, created_by: userId })
      .select('id')
      .single();
    if (channel) {
      await this.supabase.client
        .from('channel_members')
        .insert({ channel_id: channel.id, user_id: userId });
    }
  }

  async updateChannel(oldName: string, name: string, description: string): Promise<void> {
    await this.supabase.client.from('channels').update({ name, description }).eq('name', oldName);
  }

  async addMembers(channelName: string, memberNames: string[]): Promise<void> {
    const channelId = await this.channelIdOf(channelName);
    const userIds = await this.userIdsOf(memberNames);
    if (!channelId || userIds.length === 0) {
      return;
    }
    await this.supabase.client.from('channel_members').upsert(
      userIds.map((userId) => ({ channel_id: channelId, user_id: userId })),
      { onConflict: 'channel_id,user_id', ignoreDuplicates: true },
    );
  }

  async removeMembers(channelName: string, memberNames: string[]): Promise<void> {
    const channelId = await this.channelIdOf(channelName);
    const userIds = await this.userIdsOf(memberNames);
    if (!channelId || userIds.length === 0) {
      return;
    }
    await this.supabase.client
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .in('user_id', userIds);
  }

  async leaveChannel(channelName: string): Promise<void> {
    const channelId = await this.channelIdOf(channelName);
    const userId = await this.currentUserId();
    if (!channelId || !userId) {
      return;
    }
    await this.supabase.client
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId);
  }

  async sendMessage(chatKey: string, text: string): Promise<void> {
    const target = await this.targetOf(chatKey);
    const userId = await this.currentUserId();
    if (!target || !userId) {
      return;
    }
    await this.supabase.client
      .from('messages')
      .insert({ author_id: userId, text, [target.column]: target.id });
  }

  async loadMessages(chatKey: string): Promise<MessageRecord[]> {
    const target = await this.targetOf(chatKey);
    if (!target) {
      return [];
    }
    const { data: messages } = await this.supabase.client
      .from('messages')
      .select('id, text, author_id, created_at')
      .eq(target.column, target.id)
      .order('created_at', { ascending: true });
    const authorIds = [
      ...new Set((messages ?? []).map((message) => message.author_id).filter(Boolean)),
    ];
    const { data: profiles } =
      authorIds.length > 0
        ? await this.supabase.client.from('profiles').select('id, name, avatar').in('id', authorIds)
        : { data: [] };
    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const me = await this.currentUserId();

    return (messages ?? []).map((message) => {
      const profile = message.author_id ? profileById.get(message.author_id) : undefined;
      const created = new Date(message.created_at);
      return {
        id: message.id,
        text: message.text,
        author: profile?.name ?? '',
        avatar: profile?.avatar || '/icons/avatar-frederik-beck.svg',
        time: created.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        dayLabel: dayLabel(created),
        own: message.author_id === me,
      };
    });
  }

  async editMessage(id: string, text: string): Promise<void> {
    await this.supabase.client
      .from('messages')
      .update({ text, edited_at: new Date().toISOString() })
      .eq('id', id);
  }

  async deleteMessage(id: string): Promise<void> {
    await this.supabase.client.from('messages').delete().eq('id', id);
  }

  private async targetOf(chatKey: string): Promise<{ column: string; id: string } | null> {
    if (chatKey.startsWith('dm:')) {
      const otherName = chatKey.slice(3);
      const me = await this.currentUserId();
      const { data: other } = await this.supabase.client
        .from('profiles')
        .select('id')
        .eq('name', otherName)
        .maybeSingle();
      if (!me || !other) {
        return null;
      }
      const [userA, userB] = [me, other.id].sort();
      const { data: existing } = await this.supabase.client
        .from('direct_chats')
        .select('id')
        .eq('user_a', userA)
        .eq('user_b', userB)
        .maybeSingle();
      if (existing) {
        return { column: 'direct_chat_id', id: existing.id };
      }
      const { data: created } = await this.supabase.client
        .from('direct_chats')
        .insert({ user_a: userA, user_b: userB })
        .select('id')
        .single();
      return created ? { column: 'direct_chat_id', id: created.id } : null;
    }
    const channelId = await this.channelIdOf(chatKey);
    return channelId ? { column: 'channel_id', id: channelId } : null;
  }

  private async currentUserId(): Promise<string | null> {
    const { data } = await this.supabase.client.auth.getUser();
    return data.user?.id ?? null;
  }

  private async channelIdOf(name: string): Promise<string | null> {
    const { data } = await this.supabase.client
      .from('channels')
      .select('id')
      .eq('name', name)
      .maybeSingle();
    return data?.id ?? null;
  }

  private async userIdsOf(names: string[]): Promise<string[]> {
    const { data } = await this.supabase.client.from('profiles').select('id').in('name', names);
    return (data ?? []).map((profile) => profile.id);
  }

  async loadAvatars(): Promise<Record<string, string>> {
    const { data: profiles } = await this.supabase.client.from('profiles').select('name, avatar');
    return Object.fromEntries(
      (profiles ?? [])
        .filter((profile) => profile.name !== '')
        .map((profile) => [profile.name, profile.avatar || '/icons/avatar-frederik-beck.svg']),
    );
  }

  async loadChannels(): Promise<ChannelRecord[]> {
    const { data: channels } = await this.supabase.client
      .from('channels')
      .select('id, name, description, created_by');
    const { data: memberships } = await this.supabase.client
      .from('channel_members')
      .select('channel_id, user_id');
    const { data: profiles } = await this.supabase.client.from('profiles').select('id, name');

    const nameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.name]));

    return (channels ?? []).map((channel) => ({
      name: channel.name,
      description: channel.description,
      createdBy: channel.created_by ? (nameById.get(channel.created_by) ?? '') : '',
      members: (memberships ?? [])
        .filter((membership) => membership.channel_id === channel.id)
        .map((membership) => nameById.get(membership.user_id) ?? '')
        .filter((name) => name !== ''),
    }));
  }
}
