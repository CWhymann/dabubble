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

  async signUp(email: string, password: string, name: string, avatar: string) {
    return this.supabase.client.auth.signUp({
      email,
      password,
      options: {
        data: { name, avatar },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
  }

  async hasSession(): Promise<boolean> {
    const { data } = await this.supabase.client.auth.getSession();
    return data.session !== null;
  }

  async sendResetEmail(email: string) {
    return this.supabase.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  async updatePassword(password: string) {
    return this.supabase.client.auth.updateUser({ password });
  }

  async signInAsGuest() {
    return this.supabase.client.auth.signInAnonymously();
  }

  async signOut() {
    return this.supabase.client.auth.signOut({
      scope: 'local',
    });
  }

  async getProfileName(): Promise<string | null> {
    const { data: userData } = await this.supabase.client.auth.getUser();
    if (!userData.user) {
      return null;
    }
    const { data } = await this.supabase.client
      .from('profiles')
      .select('name')
      .eq('id', userData.user.id)
      .single();
    return data?.name || null;
  }

  async getUser() {
    const { data, error } = await this.supabase.client.auth.getUser();

    return {
      user: data.user,
      error,
    };
  }
}
