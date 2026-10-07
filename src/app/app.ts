import { Component } from '@angular/core';
import { ButtonGoogle } from './shared/button-google/button-google';
import { ButtonPrimary } from './shared/button-primary/button-primary';
import { ButtonSecondary } from './shared/button-secondary/button-secondary';
import { ForgotPasswordLink } from './shared/forgot-password-link/forgot-password-link';
import { InputField } from './shared/input-field/input-field';

@Component({
  selector: 'app-root',
  imports: [ButtonGoogle, ButtonPrimary, ButtonSecondary, ForgotPasswordLink, InputField],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
