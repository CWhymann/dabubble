import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IntroState } from './core/intro-state';
import { Intro } from './features/intro/intro';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [Intro, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly intro = inject(IntroState);
}
