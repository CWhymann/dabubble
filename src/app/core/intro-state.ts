import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IntroState {
  readonly running = signal(true);

  finish(): void {
    this.running.set(false);
  }
}
