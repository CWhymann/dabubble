import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { Toast } from '../../core/toast';
import { EMAIL_ERROR, EMAIL_PATTERN } from '../../core/validation';
import { AuthLayout } from '../../features/auth-layout/auth-layout';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';
import { InputField } from '../../shared/input-field/input-field';

@Component({
  selector: 'app-send-email',
  imports: [AuthLayout, ButtonPrimary, InputField, ReactiveFormsModule],
  templateUrl: './send-email.html',
})
export class SendEmail {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly toast = inject(Toast);

  protected readonly submitError = signal('');

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
  });

  protected emailError(): string {
    const email = this.form.controls.email;
    const wrongFormat = email.touched && email.hasError('pattern');
    return wrongFormat ? EMAIL_ERROR : '';
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.toast.content()) return;

    this.submitError.set('');

    const { error } = await this.auth.sendResetEmail(this.form.controls.email.value);

    if (error) {
      this.submitError.set(error.message);
      return;
    }

    await this.toast.show('E-Mail gesendet', '/icons/send-white.svg');
    await this.router.navigateByUrl('/login');
  }

  protected goBack(): void {
    this.router.navigateByUrl('/login');
  }
}
