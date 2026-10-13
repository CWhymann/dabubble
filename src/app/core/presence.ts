import { Injectable, inject } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Supabase } from './supabase';
import { setOnlineNames } from './users';

@Injectable({ providedIn: 'root' })
export class Presence {
  private readonly supabase = inject(Supabase);
  private channel: RealtimeChannel | null = null;

  start(ownName: string): void {
    this.stop();
    if (!ownName) {
      return;
    }
    const channel = this.supabase.client.channel('online-users', {
      config: { presence: { key: ownName } },
    });
    channel
      .on('presence', { event: 'sync' }, () => {
        setOnlineNames(Object.keys(channel.presenceState()));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ name: ownName });
        }
      });
    this.channel = channel;
  }

  stop(): void {
    if (this.channel) {
      void this.supabase.client.removeChannel(this.channel);
      this.channel = null;
    }
    setOnlineNames([]);
  }
}
