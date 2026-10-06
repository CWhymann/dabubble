import { Component } from '@angular/core';
import { ButtonPrimary } from './shared/button-primary/button-primary';

@Component({
  selector: 'app-root',
  imports: [ButtonPrimary],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
