import { Component } from '@angular/core';
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
    TextLink,
  ],
  templateUrl: './login.html',
})
export class Login {}
