import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { APP_ENVIRONMENT } from '../config/app-environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientFactory {
  private readonly env = inject(APP_ENVIRONMENT);
  private client: SupabaseClient | null = null;

  getClient(): SupabaseClient | null {
    if (!this.env.supabaseUrl || !this.env.supabaseAnonKey) {
      return null;
    }

    this.client ??= createClient(this.env.supabaseUrl, this.env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });

    return this.client;
  }
}
