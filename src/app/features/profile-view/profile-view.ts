import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.html',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class ProfileView {
  readonly name = input.required<string>();
  readonly avatar = input.required<string>();
  readonly email = input.required<string>();
  readonly closed = output<void>();
  readonly editRequested = output<void>();
}
