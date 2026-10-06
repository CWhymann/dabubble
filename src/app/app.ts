import { Component } from '@angular/core';
import { ButtonPrimary } from './shared/button-primary/button-primary';
import { ButtonSecondary } from './shared/button-secondary/button-secondary';
import { InputField } from './shared/input-field/input-field';

@Component({
  selector: 'app-root',
  imports: [ButtonPrimary, ButtonSecondary, InputField],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
