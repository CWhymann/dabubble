import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AVATARS } from '../../core/avatars';
import { RegisterState } from '../../core/register-state';
import { AuthLayout } from '../../features/auth-layout/auth-layout';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';

@Component({
  selector: 'app-avatar',
  imports: [AuthLayout, ButtonPrimary],
  templateUrl: './avatar.html',
})
export class Avatar {
  private readonly router = inject(Router);
  private readonly registerState = inject(RegisterState);

  protected readonly avatars = AVATARS;
  protected readonly selected = this.registerState.avatar;
  protected readonly name = computed(() => this.registerState.data()?.name ?? '');

  protected select(src: string): void {
    this.registerState.selectAvatar(src);
  }

  protected goBack(): void {
    this.router.navigateByUrl('/register');
  }

  protected submit(): void {
    if (!this.selected()) return;
    this.router.navigateByUrl('/login');
  }
}
