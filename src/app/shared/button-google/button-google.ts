import { Component, inject } from '@angular/core';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-button-google',
  templateUrl: './button-google.html',
  host: { class: 'block w-full max-w-125' },
})
export class ButtonGoogle {
  private readonly auth = inject(Auth);

  protected async signIn(): Promise<void> {
    await this.auth.signInWithGoogle();
  }
}
