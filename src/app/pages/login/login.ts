import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayout } from '../../features/auth-layout/auth-layout';
import { ButtonGoogle } from '../../shared/button-google/button-google';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';
import { ButtonSecondary } from '../../shared/button-secondary/button-secondary';
import { ForgotPasswordLink } from '../../shared/forgot-password-link/forgot-password-link';
import { InputField } from '../../shared/input-field/input-field';
import { OrDivider } from '../../shared/or-divider/or-divider';
import { TextLink } from '../../shared/text-link/text-link';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
    TextLink,
  ],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', Validators.required],
  });

  protected emailError(): string {
    const email = this.form.controls.email;
    return email.touched && email.invalid ? '*Diese E-Mail-Adresse ist leider ungültig.' : '';
  }
}
