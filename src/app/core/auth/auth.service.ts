import { Injectable, signal } from '@angular/core';
import { UserRole } from '../../features/digital-card/domain/digital-card.types';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AuthUser | null>(readStoredUser());
  readonly isAuthenticated = signal(Boolean(readStoredUser()));

  login(email: string): void {
    const role: UserRole = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const user: AuthUser = {
      id: 'd9b9726c-b1eb-4b10-8e47-9e515e901c6c',
      email,
      name: role === 'ADMIN' ? 'Sebastian Torres' : 'Sebastian Torres',
      role,
    };

    localStorage.setItem('cspe_session', JSON.stringify(user));
    this.user.set(user);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('cspe_session');
    this.user.set(null);
    this.isAuthenticated.set(false);
  }
}

function readStoredUser(): AuthUser | null {
  const stored = localStorage.getItem('cspe_session');
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem('cspe_session');
    return null;
  }
}
