import { Routes } from '@angular/router';
import { Avatar } from './pages/avatar/avatar';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ResetPassword } from './pages/reset-password/reset-password';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/avatar', component: Avatar },
  { path: 'reset-password', component: ResetPassword },
  { path: 'home', component: Home },
];
