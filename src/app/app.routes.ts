import { Routes } from '@angular/router';
import { Avatar } from './pages/avatar/avatar';
import { Home } from './pages/home/home';
import { Imprint } from './pages/imprint/imprint';
import { Login } from './pages/login/login';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Register } from './pages/register/register';
import { ResetPassword } from './pages/reset-password/reset-password';
import { SendEmail } from './pages/send-email/send-email';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/avatar', component: Avatar },
  { path: 'send-email', component: SendEmail },
  { path: 'reset-password', component: ResetPassword },
  { path: 'home', component: Home },
  { path: 'impressum', component: Imprint },
  { path: 'datenschutz', component: PrivacyPolicy },
];
