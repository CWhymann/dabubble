import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly supabase = inject(Supabase);

  async signIn(email: string, password: string) {
    return this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signUp(email: string, password: string) {
    return this.supabase.client.auth.signUp({
      email,
      password,
    });
  }

  async sendResetEmail(email: string) {
    return this.supabase.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  async updatePassword(password: string) {
    return this.supabase.client.auth.updateUser({ password });
  }

  async signOut() {
    return this.supabase.client.auth.signOut({
      scope: 'local',
    });
  }

  async getUser() {
    const { data, error } = await this.supabase.client.auth.getUser();

    return {
      user: data.user,
      error,
    };
  }
}
