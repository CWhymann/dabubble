import { Injectable, signal } from '@angular/core';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class RegisterState {
  readonly data = signal<RegisterData | null>(null);
  readonly avatar = signal<string | null>(null);

  save(data: RegisterData): void {
    this.data.set(data);
  }

  selectAvatar(src: string): void {
    this.avatar.set(src);
  }

  clear(): void {
    this.data.set(null);
    this.avatar.set(null);
  }
}
