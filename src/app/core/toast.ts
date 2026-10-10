import { Injectable, signal } from '@angular/core';

const TOAST_DURATION = 2000;

export interface ToastContent {
  text: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class Toast {
  readonly content = signal<ToastContent | null>(null);

  async show(text: string, icon = ''): Promise<void> {
    this.content.set({ text, icon });
    await new Promise<void>((resolve) => setTimeout(resolve, TOAST_DURATION));
    this.content.set(null);
  }
}
