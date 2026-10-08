import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterState } from '../../core/register-state';
import {
  EMAIL_ERROR,
  EMAIL_PATTERN,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MIN_LENGTH,
} from '../../core/validation';
import { AuthLayout } from '../../features/auth-layout/auth-layout';
import { ButtonPrimary } from '../../shared/button-primary/button-primary';
import { Checkbox } from '../../shared/checkbox/checkbox';
import { InputField } from '../../shared/input-field/input-field';

@Component({
  selector: 'app-register',
  imports: [AuthLayout, ButtonPrimary, Checkbox, InputField, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly registerState = inject(RegisterState);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
    privacy: [false, [Validators.requiredTrue]],
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

  protected submit(): void {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.getRawValue();
    this.registerState.save({ name, email, password });
    this.router.navigateByUrl('/register/avatar');
  }

  protected goBack(): void {
    this.router.navigateByUrl('/login');
  }
}
