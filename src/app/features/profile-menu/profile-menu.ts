import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.html',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'close()',
  },
})
export class ProfileMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly name = input.required<string>();
  readonly avatar = input.required<string>();

  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  close(): void {
    this.open.set(false);
  }

  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected async logOut(): Promise<void> {
    await this.auth.signOut();
    this.close();
    await this.router.navigateByUrl('/login');
  }
}
