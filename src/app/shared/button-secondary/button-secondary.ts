import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button-secondary',
  templateUrl: './button-secondary.html',
})
export class ButtonSecondary {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}

