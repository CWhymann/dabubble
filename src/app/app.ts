import { Component } from '@angular/core';
import { ButtonPrimary } from './shared/button-primary/button-primary';
import { ButtonSecondary } from './shared/button-secondary/button-secondary';

@Component({
  selector: 'app-root',
  imports: [ButtonPrimary, ButtonSecondary],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
