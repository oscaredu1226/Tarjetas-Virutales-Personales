import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AppEnvironment {
  readonly production: boolean;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly publicBaseUrl: string;
}

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('APP_ENVIRONMENT', {
  factory: () => environment,
});
