import { Component, inject } from '@angular/core';
import { IntroState } from '../../core/intro-state';
import { Logo } from '../../shared/logo/logo';
import { TextLink } from '../../shared/text-link/text-link';

@Component({
  selector: 'app-auth-layout',
  imports: [Logo, TextLink],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  protected readonly intro = inject(IntroState);
}
