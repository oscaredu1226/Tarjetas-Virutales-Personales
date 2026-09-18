import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../auth/auth.service';
import { DemoDigitalCardRepository } from '../../features/digital-card/infrastructure/demo-digital-card.repository';

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-private-shell',
  template: `
    <div class="app-shell" [class.sidebar-open]="sidebarOpen()" [class.sidebar-collapsed]="sidebarCollapsed()">
      @if (sidebarOpen()) {
        <button class="sidebar-backdrop" type="button" aria-label="Cerrar menu" (click)="closeSidebar()"></button>
      }
      <aside
        class="sidebar"
        aria-label="Navegacion principal"
        [attr.aria-hidden]="mobileMenuHidden() ? 'true' : null"
        [attr.inert]="mobileMenuHidden() ? '' : null"
      >
        <a class="brand" routerLink="/dashboard" aria-label="Ir al resumen" (click)="closeSidebar()">
          <img src="/assets/branding/ciberseguridad-logo-sidebar.png" alt="CIBERSEGURIDAD.pe - Gestores de tu seguridad" class="sidebar-logo" />
        </a>
        <nav>
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }" (click)="closeSidebar()">
              <span aria-hidden="true"><ng-icon [name]="item.icon" /></span>
              {{ item.label }}
            </a>
          }
          @if (auth.user()?.role === 'ADMIN') {
            <a routerLink="/admin" routerLinkActive="active" (click)="closeSidebar()">
              <span aria-hidden="true"><ng-icon name="lucideSettings" /></span>
              Administracion
            </a>
          }
        </nav>
        <div class="sidebar-note">
          <span class="shield"><ng-icon name="lucideShieldCheck" /></span>
          <p>Tecnologia que conecta oportunidades seguras</p>
        </div>
      </aside>

      <div class="workspace">
        <header class="topbar">
          <button class="icon-button" type="button" (click)="toggleSidebar()" [attr.aria-expanded]="menuButtonExpanded()" [attr.aria-label]="menuButtonLabel()">
            <ng-icon name="lucideMenu" />
          </button>
          <div class="topbar-user">
            <span class="avatar">{{ initials() }}</span>
            <span>
              <strong>{{ auth.user()?.name ?? 'Sebastian Torres' }}</strong>
              <small>{{ auth.user()?.role === 'ADMIN' ? 'Administrador' : 'Propietario de tarjeta' }}</small>
            </span>
            <button class="ghost-button" type="button" (click)="logout()"><ng-icon name="lucideLogOut" />Salir</button>
          </div>
        </header>
        <main class="content-area">
          <div class="tech-hero" aria-hidden="true">
            <blockquote>"La seguridad tambien conecta personas"</blockquote>
          </div>
          <router-outlet />
        </main>
        <footer class="app-footer">
          <strong>CIBERSEGURIDAD.pe</strong>
          <span>Gestores de tu seguridad</span>
          <nav aria-label="Enlaces legales">
            <button type="button" (click)="openLegal('Soporte')">Soporte</button>
            <button type="button" (click)="openLegal('Terminos')">Terminos</button>
            <button type="button" (click)="openLegal('Privacidad')">Privacidad</button>
            <span>v1.0.0</span>
          </nav>
        </footer>
        @if (legalPanel()) {
          <div class="modal-backdrop" role="presentation" (click)="closeLegal()"></div>
          <section class="modal-panel" role="dialog" aria-modal="true" [attr.aria-label]="legalPanel()">
            <div class="section-title">
              <h2>{{ legalPanel() }}</h2>
              <button class="icon-button" type="button" aria-label="Cerrar" (click)="closeLegal()"><ng-icon name="lucideX" /></button>
            </div>
            <p>{{ legalText() }}</p>
          </section>
        }
      </div>
    </div>
  `,
})
export class PrivateShellComponent {
  readonly auth = inject(AuthService);
  readonly data = inject(DemoDigitalCardRepository);
  readonly router = inject(Router);
  readonly sidebarOpen = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly legalPanel = signal<'Soporte' | 'Terminos' | 'Privacidad' | ''>('');
  readonly navItems: readonly NavItem[] = [
    { label: 'Resumen', icon: 'lucideHouse', path: '/dashboard' },
    { label: 'Mi Perfil', icon: 'lucideUser', path: '/dashboard/profile' },
    { label: 'Contacto', icon: 'lucideContact', path: '/dashboard/contact' },
    { label: 'Redes', icon: 'lucideShare2', path: '/dashboard/social' },
    { label: 'Enlaces', icon: 'lucideLink', path: '/dashboard/links' },
    { label: 'Apariencia', icon: 'lucidePalette', path: '/dashboard/appearance' },
    { label: 'Mi QR y NFC', icon: 'lucideQrCode', path: '/dashboard/card' },
    { label: 'Contactos Recibidos', icon: 'lucideUsers', path: '/dashboard/contacts' },
  ];

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closeSidebar();
  }

  @HostListener('window:resize')
  closeMobileMenuOnResize(): void {
    if (!this.isMobileMenu()) {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    if (this.isMobileMenu()) {
      this.sidebarOpen.update((open) => !open);
      return;
    }

    this.sidebarOpen.set(false);
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  closeSidebar(): void {
    if (this.isMobileMenu()) {
      this.sidebarOpen.set(false);
    }
  }

  menuButtonExpanded(): boolean {
    return this.isMobileMenu() ? this.sidebarOpen() : !this.sidebarCollapsed();
  }

  menuButtonLabel(): string {
    if (this.isMobileMenu()) {
      return this.sidebarOpen() ? 'Cerrar menu' : 'Abrir menu';
    }

    return this.sidebarCollapsed() ? 'Mostrar menu lateral' : 'Ocultar menu lateral';
  }

  mobileMenuHidden(): boolean {
    return this.isMobileMenu() && !this.sidebarOpen();
  }

  private isMobileMenu(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
  }

  initials(): string {
    const profile = this.data.profile();
    return `${profile.firstName[0]}${profile.lastName[0]}`;
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  openLegal(section: 'Soporte' | 'Terminos' | 'Privacidad'): void {
    this.legalPanel.set(section);
  }

  closeLegal(): void {
    this.legalPanel.set('');
  }

  legalText(): string {
    if (this.legalPanel() === 'Soporte') {
      return 'Canal de soporte demo: soporte@ciberseguridad.pe. En produccion este acceso abrira la mesa de ayuda.';
    }

    if (this.legalPanel() === 'Terminos') {
      return 'Terminos demo: la tarjeta digital se gestiona bajo politicas de uso corporativo y proteccion de datos.';
    }

    return 'Privacidad demo: tu decides que datos se muestran publicamente desde Contacto y visibilidad.';
  }
}
