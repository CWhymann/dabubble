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

  async getCurrentProfile(): Promise<{
    name: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
  } | null> {
    const { data: userData } = await this.supabase.client.auth.getUser();
    const user = userData.user;
    if (!user) {
      return null;
    }
    const { data } = await this.supabase.client
      .from('profiles')
      .select('name, avatar, is_admin')
      .eq('id', user.id)
      .single();
    const fallback = user.is_anonymous ? 'Gast' : (user.email?.split('@')[0] ?? 'Gast');
    return {
      name: data?.name || fallback,
      email: user.email ?? '',
      avatar: data?.avatar || '/icons/avatar-frederik-beck.svg',
      isAdmin: data?.is_admin === true,
    };
  }

  async getUser() {
    const { data, error } = await this.supabase.client.auth.getUser();

    return {
      user: data.user,
      error,
    };
  }
}
