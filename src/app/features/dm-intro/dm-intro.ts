import { Component, computed, input, output } from '@angular/core';
import { ChatUser, isOwnUser } from '../../core/users';

@Component({
  selector: 'app-dm-intro',
  templateUrl: './dm-intro.html',
})
export class DmIntro {
  readonly user = input.required<ChatUser>();
  readonly showProfile = output<string>();

  protected readonly own = computed(() => isOwnUser(this.user()));
  protected readonly label = computed(() =>
    this.own() ? `${this.user().name} (Du)` : this.user().name,
  );
}
