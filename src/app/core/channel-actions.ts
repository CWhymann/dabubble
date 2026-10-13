import { Injectable, inject } from '@angular/core';
import { ChatStore } from './chat-store';
import { Data } from './data';

@Injectable({ providedIn: 'root' })
export class ChannelActions {
  private readonly data = inject(Data);
  private readonly store = inject(ChatStore);

  create(name: string): Promise<void> {
    return this.data.createChannel(name, '');
  }

  update(oldName: string, newName: string, description: string): Promise<void> {
    return this.data.updateChannel(oldName, newName, description);
  }

  addMembers(channel: string, names: string[]): Promise<void> {
    return this.data.addMembers(channel, names);
  }

  async removeMembers(channel: string, names: string[], actorName: string): Promise<void> {
    await this.data.removeMembers(channel, names);
    for (const name of names) {
      this.store.notify(channel, `${actorName} hat ${name} aus dem Channel entfernt.`);
    }
  }

  async leave(channel: string, actorName: string): Promise<void> {
    await this.data.leaveChannel(channel);
    this.store.notify(channel, `${actorName} hat den Channel verlassen.`);
  }
}
