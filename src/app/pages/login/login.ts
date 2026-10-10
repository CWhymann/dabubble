import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth';
import {
  EMAIL_ERROR,
  EMAIL_PATTERN,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MIN_LENGTH,
} from '../../core/validation';
import { AuthLayout } from '../../features/auth-layout/auth-layout';
import { ButtonGoogle } from '../../shared/button-google/button-google';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';
import { ButtonSecondary } from '../../shared/button-secondary/button-secondary';
import { ForgotPasswordLink } from '../../shared/forgot-password-link/forgot-password-link';
import { InputField } from '../../shared/input-field/input-field';
import { OrDivider } from '../../shared/or-divider/or-divider';
import { TextLink } from '../../shared/text-link/text-link';

@Component({
  selector: 'app-login',
  imports: [
    AuthLayout,
    ButtonGoogle,
    ButtonPrimary,
    ButtonSecondary,
    ForgotPasswordLink,
    InputField,
    OrDivider,
    ReactiveFormsModule,
    RouterLink,
    TextLink,
  ],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  protected readonly loginError = signal('');

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
  });

  protected emailError(): string {
    const email = this.form.controls.email;
    const wrongFormat = email.touched && email.hasError('pattern');
    return wrongFormat ? EMAIL_ERROR : '';
  }

  protected passwordError(): string {
    const password = this.form.controls.password;
    const tooShort = password.touched && password.hasError('minlength');
    return tooShort ? PASSWORD_LENGTH_ERROR : '';
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) return;

    this.loginError.set('');

    const { email, password } = this.form.getRawValue();
    const { error } = await this.auth.signIn(email, password);

    if (error) {
      this.loginError.set(error.message);
      return;
    }

    await this.router.navigateByUrl('/home');
  }

  protected async guestLogin(): Promise<void> {
    this.loginError.set('');

    const { error } = await this.auth.signInAsGuest();

    if (error) {
      this.loginError.set(error.message);
      return;
    }

    await this.router.navigateByUrl('/home');
  }
}
