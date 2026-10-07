import { Component, signal } from '@angular/core';
import { Intro } from './features/intro/intro';
import { Login } from './pages/login/login';

@Component({
  selector: 'app-root',
  imports: [Intro, Login],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly introRunning = signal(true);
}
