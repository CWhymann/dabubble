import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.html',
})
export class InputField {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly name = input('');
  readonly placeholder = input('');
}
