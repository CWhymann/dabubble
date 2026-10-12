import { Component, DestroyRef, inject, input, output } from '@angular/core';

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
