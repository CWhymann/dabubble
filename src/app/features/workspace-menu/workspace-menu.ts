import { Component, input, output, signal } from '@angular/core';
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

  protected readonly users = DM_USERS;
  protected readonly ownName = OWN_USER.name;

  protected toggleChannels(): void {
    this.channelsOpen.update((open) => !open);
  }

  protected toggleUsers(): void {
    this.usersOpen.update((open) => !open);
  }
}
