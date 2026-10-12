import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AVATARS } from '../../core/avatars';
import { Auth } from '../../core/auth';
import { RegisterState } from '../../core/register-state';
import { Toast } from '../../core/toast';
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
  private readonly toast = inject(Toast);
  private readonly auth = inject(Auth);

  protected readonly avatars = AVATARS;
  protected readonly selected = this.registerState.avatar;
  protected readonly name = computed(() => this.registerState.data()?.name ?? '');

  protected select(src: string): void {
    this.registerState.selectAvatar(src);
  }

  protected goBack(): void {
    this.router.navigateByUrl('/register');
  }

  protected async submit(): Promise<void> {
    const data = this.registerState.data();
    const avatar = this.selected();
    if (!avatar || !data || this.toast.content()) return;

    const { error } = await this.auth.signUp(data.email, data.password, data.name, avatar);

    if (error) {
      await this.toast.show('Das Konto konnte nicht erstellt werden.');
      return;
    }

    this.registerState.clear();
    await this.toast.show('Konto erfolgreich erstellt!');
    await this.router.navigateByUrl('/login');
  }
}
