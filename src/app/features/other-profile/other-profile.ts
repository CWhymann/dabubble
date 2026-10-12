import { Component, DestroyRef, inject, input, output } from '@angular/core';
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
  readonly hasPrevious = input(false);
  readonly hasNext = input(false);
  readonly previous = output<void>();
  readonly next = output<void>();
  readonly messageRequested = output<void>();

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    document.body.style.overflow = 'hidden';
    this.destroyRef.onDestroy(() => (document.body.style.overflow = ''));
  }
}
