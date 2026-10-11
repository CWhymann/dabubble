import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-profile-menu',
  imports: [ConfirmDialog],
  templateUrl: './profile-menu.html',
  host: {
    class: 'block min-w-0',
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
  readonly openProfile = output<void>();

  protected readonly open = signal(false);
  protected readonly logoutConfirmOpen = signal(false);

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

  protected showProfile(): void {
    this.close();
    this.openProfile.emit();
  }

  protected askLogOut(): void {
    this.close();
    this.logoutConfirmOpen.set(true);
  }

  protected async logOut(): Promise<void> {
    this.logoutConfirmOpen.set(false);
    await this.auth.signOut();
    this.close();
    await this.router.navigateByUrl('/login');
  }
}
