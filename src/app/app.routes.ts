import { Routes } from '@angular/router';
import { Avatar } from './pages/avatar/avatar';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/avatar', component: Avatar },
  { path: 'home', component: Home },
];
