import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ChatStatus } from '../../core/chat-status';
import { DM_USERS, OWN_USER } from '../../core/users';

@Component({
  selector: 'app-workspace-menu',
  templateUrl: './workspace-menu.html',
})
export class WorkspaceMenu {
  readonly channels = input.required<string[]>();
  readonly activeChannel = input.required<string | null>();
  readonly activeUser = input.required<string | null>();
  readonly addChannel = output<void>();
  readonly selectChannel = output<string>();
  readonly selectUser = output<string>();
  readonly newMessage = output<void>();

  protected readonly channelsOpen = signal(true);
  protected readonly usersOpen = signal(true);

  private readonly chatStatus = inject(ChatStatus);
  protected readonly status = this.chatStatus.status;

  protected readonly users = computed(() => {
    const status = this.status();
    const rank = (name: string) => status[`dm:${name}`]?.lastAt ?? '';
    return [...DM_USERS].sort((a, b) => {
      const byTime = rank(b.name).localeCompare(rank(a.name));
      return byTime !== 0 ? byTime : a.name.localeCompare(b.name);
    });
  });

  protected unreadDm(name: string): boolean {
    return this.status()[`dm:${name}`]?.unread === true;
  }

  protected unreadChannel(name: string): boolean {
    return this.status()[name]?.unread === true;
  }

  protected get ownName(): string {
    return OWN_USER.name;
  }

  protected toggleChannels(): void {
    this.channelsOpen.update((open) => !open);
  }

  protected toggleUsers(): void {
    this.usersOpen.update((open) => !open);
  }
}
