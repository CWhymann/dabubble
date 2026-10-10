import { Component, input, output } from '@angular/core';
import { ChatUser } from '../../core/users';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class OtherProfile {
  readonly user = input.required<ChatUser>();
  readonly closed = output<void>();
}
