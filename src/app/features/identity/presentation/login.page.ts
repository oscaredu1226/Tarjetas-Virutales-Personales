import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ReactiveFormsModule, RouterLink],
  template: `
    <main class="login-page">
      <section class="login-panel">
        <a class="brand login-brand" routerLink="/login">
          <img src="/assets/branding/app-icon.png" alt="" class="login-brand-icon" />
          <span class="login-wordmark">
            <strong>CIBERSEGURIDAD.pe</strong>
            <small>GESTORES DE TU SEGURIDAD</small>
          </span>
        </a>
        <div class="login-copy">
          <h1>Iniciar sesión</h1>
          <p>Accede a tu panel y gestiona tu tarjeta digital NFC de forma segura.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-card" novalidate>
          <label class="login-field">
            <span class="login-field-icon"><ng-icon name="lucideMail" /></span>
            <span class="login-field-control">
              <span class="field-title">Correo</span>
              <span class="input-field">
              <input type="email" formControlName="email" autocomplete="email" placeholder="tu@empresa.com" />
              </span>
            </span>
          </label>
          <label class="login-field">
            <span class="login-field-icon"><ng-icon name="lucideLock" /></span>
            <span class="login-field-control">
              <span class="field-title">Contraseña</span>
              <span class="input-field">
                <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" placeholder="Ingresa tu contraseña" />
                <button class="field-action" type="button" (click)="showPassword.update((visible) => !visible)" [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <ng-icon [name]="showPassword() ? 'lucideEyeOff' : 'lucideEye'" />
                </button>
              </span>
            </span>
          </label>
          <div class="form-row split">
            <label class="checkbox">
              <input type="checkbox" formControlName="remember" />
              Recordar sesión
            </label>
            <a routerLink="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          <button class="primary-button" type="submit"><ng-icon name="lucideLogIn" />Ingresar al panel</button>
        </form>
      </section>
      <section class="login-visual" aria-label="Identidad digital segura">
        <blockquote>"La seguridad tambien conecta personas"</blockquote>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly showPassword = signal(false);
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    remember: new FormControl(true, { nonNullable: true }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.login(this.form.controls.email.value);
    void this.router.navigate(['/dashboard']);
  }
}
