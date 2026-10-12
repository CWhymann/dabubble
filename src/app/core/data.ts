import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';

export interface ChannelRecord {
  name: string;
  description: string;
  createdBy: string;
  members: string[];
}

@Injectable({ providedIn: 'root' })
export class Data {
  private readonly supabase = inject(Supabase);

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
