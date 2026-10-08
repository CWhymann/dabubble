import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { PASSWORD_LENGTH_ERROR, PASSWORD_MIN_LENGTH } from '../../core/validation';
import { AuthLayout } from '../../features/auth-layout/auth-layout';

@Component({
  selector: 'app-reset-password',
  imports: [AuthLayout, ReactiveFormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  protected readonly submitError = signal('');

  protected readonly form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
    confirmPassword: ['', [Validators.required]],
  });

  protected passwordError(): string {
    const password = this.form.controls.password;

    return password.touched && password.hasError('minlength') ? PASSWORD_LENGTH_ERROR : '';
  }

  protected confirmPasswordError(): string {
    const confirmPassword = this.form.controls.confirmPassword;

    if (!confirmPassword.touched) return '';
    if (confirmPassword.hasError('required')) {
      return 'Bitte bestätige dein neues Passwort.';
    }

    return confirmPassword.value !== this.form.controls.password.value
      ? 'Die Passwörter stimmen nicht überein.'
      : '';
  }

  protected async submit(): Promise<void> {
    this.submitError.set('');
    this.form.markAllAsTouched();

    if (
      this.form.invalid ||
      this.form.controls.password.value !== this.form.controls.confirmPassword.value
    ) {
      return;
    }

    const { error } = await this.auth.updatePassword(this.form.controls.password.value);

    if (error) {
      this.submitError.set(error.message);
      return;
    }

    await this.router.navigateByUrl('/login');
  }

  protected goBack(): void {
    this.router.navigateByUrl('/login');
  }
}
