import { Component, computed, input, output } from '@angular/core';
import { ChatUser, OWN_USER, isOwnUser } from '../../core/users';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class ChannelMembers {
  readonly memberNames = input.required<string[]>();
  readonly memberAvatars = input<Record<string, string>>({});
  readonly closed = output<void>();
  readonly showProfile = output<string>();
  readonly addMembers = output<void>();

  protected readonly members = computed<ChatUser[]>(() =>
    this.memberNames().map((name) => ({
      name,
      avatar: this.memberAvatars()[name] ?? '/icons/avatar-frederik-beck.svg',
      email: name === OWN_USER.name ? OWN_USER.email : '',
      online: true,
    })),
  );

  protected label(user: ChatUser): string {
    return isOwnUser(user) ? `${user.name} (Du)` : user.name;
  }
}
