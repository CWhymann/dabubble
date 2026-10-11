import { Component, computed, input, output } from '@angular/core';
import { ChatUser, isOwnUser } from '../../core/users';

@Component({
  selector: 'app-dm-header',
  templateUrl: './dm-header.html',
})
export class DmHeader {
  readonly user = input.required<ChatUser>();
  readonly showProfile = output<string>();

  protected readonly label = computed(() =>
    isOwnUser(this.user()) ? `${this.user().name} (Du)` : this.user().name,
  );
}
