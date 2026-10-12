import { Component, computed, input, output } from '@angular/core';
import { ChatUser, DM_USERS, isOwnUser } from '../../core/users';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class ChannelMembers {
  readonly memberNames = input.required<string[]>();
  readonly closed = output<void>();
  readonly showProfile = output<string>();
  readonly addMembers = output<void>();

  protected readonly members = computed(() =>
    this.memberNames()
      .map((name) => DM_USERS.find((user) => user.name === name))
      .filter((user): user is ChatUser => user !== undefined),
  );

  protected label(user: ChatUser): string {
    return isOwnUser(user) ? `${user.name} (Du)` : user.name;
  }
}
