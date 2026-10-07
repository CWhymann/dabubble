import { Component, DestroyRef, computed, inject, output, signal } from '@angular/core';

const DOCK_DELAY_MS = 2500;
const DOCK_DURATION_MS = 500;

const CENTERED =
  'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40px] sm:text-[64px] lg:text-[102px]';

const DOCKED =
  'top-18 left-1/2 -translate-x-1/2 translate-y-0 text-[30px] lg:top-18.75 lg:left-18.75 lg:translate-x-0 lg:text-[35.5px]';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.html',
})
export class Intro {
  readonly finished = output<void>();

  protected readonly docked = signal(false);
  protected readonly position = computed(() => (this.docked() ? DOCKED : CENTERED));
  protected readonly textColor = computed(() => (this.docked() ? 'text-black' : 'text-white'));

  constructor() {
    const dockTimer = setTimeout(() => this.docked.set(true), DOCK_DELAY_MS);
    const doneTimer = setTimeout(() => this.finished.emit(), DOCK_DELAY_MS + DOCK_DURATION_MS);
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(dockTimer);
      clearTimeout(doneTimer);
    });
  }
}
