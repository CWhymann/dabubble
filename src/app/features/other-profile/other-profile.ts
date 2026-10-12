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
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    this.destroyRef.onDestroy(() => {
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    });
  }
}
