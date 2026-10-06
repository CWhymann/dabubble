import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  templateUrl: './button-primary.html',
})
export class ButtonPrimary {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
